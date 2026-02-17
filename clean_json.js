const fs = require('fs');
const data = JSON.parse(fs.readFileSync('assets/trainDetails.json', 'utf8'));

Object.values(data).forEach(train => {
    train.routes.forEach(stop => {
        stop.station = stop.station.trim().normalize();
    });
});

fs.writeFileSync('assets/trainDetails.json', JSON.stringify(data, null, 2), 'utf8');
console.log('Sanitization complete.');
