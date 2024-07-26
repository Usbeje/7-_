const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function showLogo() {
    console.log(`
 █████╗ ██╗   ██╗████████╗ ██████╗    ██╗   ██╗██████╗ ██╗      ██████╗  █████╗ ██████╗ 
██╔══██╗██║   ██║╚══██╔══╝██╔═══██╗   ██║   ██║██╔══██╗██║     ██╔═══██╗██╔══██╗██╔══██╗
███████║██║   ██║   ██║   ██║   ██║   ██║   ██║██████╔╝██║     ██║   ██║███████║██║  ██║
██╔══██║██║   ██║   ██║   ██║   ██║   ██║   ██║██╔═══╝ ██║     ██║   ██║██╔══██║██║  ██║
██║  ██║╚██████╔╝   ██║   ╚██████╔╝▄█╗╚██████╔╝██║     ███████╗╚██████╔╝██║  ██║██████╔╝
╚═╝  ╚═╝ ╚═════╝    ╚═╝    ╚═════╝ ╚═╝ ╚═════╝ ╚═╝     ╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═════╝ 
                                                    
 By Hexon/Gabutc.                                 
    `);
}

function delayWithLoading(duration) {
    return new Promise(resolve => {
        process.stdout.write("Proses");
        let interval = setInterval(() => {
            process.stdout.write(".");
        }, 1000);

        setTimeout(() => {
            clearInterval(interval);
            console.log("");
            resolve();
        }, duration * 1000);
    });
}

async function main() {
    showLogo();

    const userName = await askQuestion("Masukkan nama akun Github kamu sepuh: ");
    await confirmInput(`Nama kamu: ${userName}. Konfirmasi? (y/n) `);
    execSync(`git config --global user.name "${userName}"`);

    const userEmail = await askValidEmail();
    await confirmInput(`Email kamu: ${userEmail}. Konfirmasi? (y/n) `);
    execSync(`git config --global user.email "${userEmail}"`);

    console.log("contoh 1;(/storage/emulated/0/nama_direktori)");
    console.log("contoh 2; (/sdcard/nama_direktori)");
    const projectPath = await askQuestion("Masukkan direktori penyimpanan proyek kamu: ");
    await delayWithLoading(2);
    execSync(`git config --global --add safe.directory "${projectPath}"`);
    process.chdir(projectPath);

    execSync('git init');
    execSync('git add .');

    const commitMessage = await askQuestion("Masukkan pesan commit Anda: ");
    execSync(`git commit -m "${commitMessage}"`);

    const repoUrl = await askQuestion("Masukkan URL repository kamu: ");
    await confirmInput(`URL repo kamu: ${repoUrl}. Konfirmasi? (y/n) `);
    execSync(`git remote add origin "${repoUrl}"`);
    execSync('git push -u origin master');

    console.log("Proses git selesai.");
    rl.close();
}

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function confirmInput(query) {
    let confirm = await askQuestion(query);
    while (confirm.toLowerCase() !== 'y') {
        confirm = await askQuestion(query);
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

async function askValidEmail() {
    let email = await askQuestion("Masukkan email akun Github kamu sepuh: ");
    while (!isValidEmail(email)) {
        console.log("Woy masukkin email yang bener, contoh: example@gmail.com/@proton.me/@yahoo.com");
        email = await askQuestion("Masukkan email akun Github kamu sepuh: ");
    }
    return email;
}

main();
