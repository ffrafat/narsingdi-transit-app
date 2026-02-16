import json
from datetime import datetime, timedelta

def parse_time(t_str):
    if not t_str or t_str.strip() == "":
        return None
    try:
        return datetime.strptime(t_str.strip(), "%H:%M")
    except ValueError:
        return None

def format_delta(delta):
    total_minutes = int(delta.total_seconds() // 60)
    hours = total_minutes // 60
    minutes = total_minutes % 60
    return f"{hours:02d}:{minutes:02d}"

def calculate_diff(t1, t2):
    """Calculate t2 - t1 handling midnight crossing."""
    if t1 is None or t2 is None:
        return None
    diff = t2 - t1
    if diff.total_seconds() < 0:
        # Crossed midnight
        diff += timedelta(days=1)
    return diff

def validate_data(file_path):
    with open(file_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    discrepancies = []

    for train_no, details in data.items():
        name = details.get("name", "Unknown")
        routes = details.get("routes", [])
        
        prev_departure_str = None
        
        for i, stop in enumerate(routes):
            station = stop.get("station")
            arrival_str = stop.get("arrival")
            departure_str = stop.get("departure")
            halt_claimed = stop.get("halt")
            duration_claimed = stop.get("duration")

            arr = parse_time(arrival_str)
            dep = parse_time(departure_str)

            # Check Halt
            if arr and dep:
                calculated_halt = calculate_diff(arr, dep)
                calculated_halt_str = format_delta(calculated_halt)
                if calculated_halt_str != halt_claimed and halt_claimed != "":
                    discrepancies.append({
                        "train": f"{name} ({train_no})",
                        "station": station,
                        "type": "Halt",
                        "expected": calculated_halt_str,
                        "found": halt_claimed
                    })

            # Check Duration (from previous station)
            if i > 0 and prev_departure_str:
                prev_dep = parse_time(prev_departure_str)
                if arr and prev_dep:
                    calculated_dur = calculate_diff(prev_dep, arr)
                    calculated_dur_str = format_delta(calculated_dur)
                    if calculated_dur_str != duration_claimed and duration_claimed != "":
                        discrepancies.append({
                            "train": f"{name} ({train_no})",
                            "station": station,
                            "type": "Duration",
                            "expected": calculated_dur_str,
                            "found": duration_claimed
                        })

            # Update prev_departure for next station
            if departure_str:
                prev_departure_str = departure_str
            else:
                # If departure is missing (terminus), use arrival for duration checks if needed
                # (though duration usually measures transit time)
                prev_departure_str = None

    return discrepancies

if __name__ == "__main__":
    file_path = r"d:\Synched Files\narsingdi-transit-app\assets\trainDetails.json"
    results = validate_data(file_path)
    
    if not results:
        print("Success: No discrepancies found in durations or halts!")
    else:
        print(f"Found {len(results)} discrepancies:")
        for res in results:
            print(f"- {res['train']} @ {res['station']}: {res['type']} expected {res['expected']}, found {res['found']}")
