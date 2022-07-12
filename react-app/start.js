const cp = require("child_process");

if (process.platform === "win32") {
    cp.execSync(
        'npm run win-start',
        {stdio: 'inherit'}
    );
}
else {
    cp.execSync(
        'npm run unix-start',
        {stdio: 'inherit'}
    );
}