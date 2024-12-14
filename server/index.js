const { fork } = require('child_process');
const { execSync } = require('child_process');

const services = [
    { name: 'Auth Service', path: './auth-microservice.js', port: 4001 },
    { name: 'Checklist Service', path: './checklist-microservice.js', port: 4002 },
    { name: 'Motivational Tips Service', path: './motivationalTips-microservice.js', port: 4003 },
    { name: 'Patient Portal Service', path: './patientPortalApp-microservice.js', port: 4004 },
    { name: 'Vital Signs Service', path: './vitalSigns-microservice.js', port: 4005 },
];

let runningServices = 0;
const totalServices = services.length;

console.log(`Starting ${totalServices} microservices...\n`);

const killPortTasks = (port) => {
    try {
        const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' });
        const lines = result.trim().split('\n');
        const pids = lines.map((line) => {
            const columns = line.trim().split(/\s+/);
            return columns[columns.length - 1];
        });

        pids.forEach((pid) => {
            console.log(`Killing process with PID: ${pid} on port ${port}`);
            execSync(`taskkill /PID ${pid} /F`);
        });

        console.log(`Port ${port} has been freed.`);
    } catch (error) {
        console.log(`No tasks found on port ${port}.`);
    }
};

const logStatus = () => {
    console.clear();
    console.log(`Microservices Running: ${runningServices}/${totalServices}\n`);
    services.forEach((service) => {
        const status = service.status || {};
        console.log(
            `[${service.name.padEnd(25)}] Port: ${service.port} | MongoDB: ${status.mongoDB || '❌'} | GraphQL: ${status.graphQL || '❌'}`
        );
    });
    console.log('\n----------------------------\n');
};

services.forEach((service) => {
    killPortTasks(service.port);

    service.status = { mongoDB: '❌', graphQL: '❌' };

    const child = fork(service.path, [], {
        stdio: ['inherit', 'pipe', 'pipe', 'ipc'],
        env: {...process.env, PORT: service.port },
    });

    runningServices++;
    console.log(`[${service.name}] Starting on port ${service.port}...`);
    logStatus();

    if (child.stdout) {
        child.stdout.on('data', (data) => {
            const output = data.toString().trim();
            console.log(`[DEBUG] Output from ${service.name}:`, output);

            if (output.includes('MongoDB connected')) {
                service.status.mongoDB = '✅';
            }

            if (output.includes('GraphQL server is running')) {
                service.status.graphQL = '✅';
            }

            logStatus();
        });
    }

    if (child.stderr) {
        child.stderr.on('data', (data) => {
            console.error(`[${service.name} Error]: ${data.toString().trim()}`);
        });
    }

    child.on('exit', (code) => {
        runningServices--;
        service.status.mongoDB = '❌';
        service.status.graphQL = '❌';
        console.log(`[${service.name}] Process exited with code ${code}`);
        logStatus();
    });

    child.on('error', (err) => {
        console.error(`[${service.name} Error]: Failed to start - ${err.message}`);
        runningServices--;
        logStatus();
    });
});