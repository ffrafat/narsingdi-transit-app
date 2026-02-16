const fs = require('fs');
const path = require('path');

function parseTime(tStr) {
    if (!tStr || tStr.trim() === "") return null;
    const [h, m] = tStr.split(':').map(Number);
    return h * 60 + m;
}

function formatDelta(minutes) {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function calculateDiff(t1, t2) {
    if (t1 === null || t2 === null) return null;
    let diff = t2 - t1;
    if (diff < 0) diff += 24 * 60; // Handle midnight crossing
    return diff;
}

const filePath = 'assets/trainDetails.json';
const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const discrepancies = [];

for (const [trainNo, details] of Object.entries(data)) {
    const name = details.name || "Unknown";
    const routes = details.routes || [];

    let prevDeparture = null;

    routes.forEach((stop, i) => {
        const station = stop.station;
        const arr = parseTime(stop.arrival);
        const dep = parseTime(stop.departure);
        const haltClaimed = stop.halt || "";
        const durationClaimed = stop.duration || "";

        // Check Halt
        if (arr !== null && dep !== null) {
            const calculatedHalt = calculateDiff(arr, dep);
            const calculatedHaltStr = formatDelta(calculatedHalt);
            if (calculatedHaltStr !== haltClaimed && haltClaimed !== "" && haltClaimed !== "—") {
                discrepancies.push({
                    train: `${name} (${trainNo})`,
                    station,
                    type: "Halt",
                    expected: calculatedHaltStr,
                    found: haltClaimed
                });
            }
        }

        // Check Duration (from previous station)
        if (i > 0 && prevDeparture !== null) {
            if (arr !== null) {
                const calculatedDur = calculateDiff(prevDeparture, arr);
                const calculatedDurStr = formatDelta(calculatedDur);
                if (calculatedDurStr !== durationClaimed && durationClaimed !== "" && durationClaimed !== "—") {
                    discrepancies.push({
                        train: `${name} (${trainNo})`,
                        station,
                        type: "Duration",
                        expected: calculatedDurStr,
                        found: durationClaimed
                    });
                }
            }
        }

        // Update prevDeparture
        if (stop.departure) {
            prevDeparture = parseTime(stop.departure);
        } else {
            prevDeparture = null;
        }
    });
}

if (discrepancies.length === 0) {
    console.log("Success: No discrepancies found in durations or halts!");
} else {
    console.log(`Found ${discrepancies.length} discrepancies:`);
    discrepancies.forEach(res => {
        console.log(`- ${res.train} @ ${res.station}: ${res.type} expected ${res.expected}, found ${res.found}`);
    });
}
