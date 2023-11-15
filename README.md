# 8490 Final Project
Establishes a connection to the Oracle database and sets up sample routing for locally-hosted projects in HTML, CSS, and JS. Utilizes NodeJS. Recommended source-code editor is Visual Studio Code.

1. Clone the repository.
2. Download NodeJS and connect it to OracleDB locally.
3. Run the app.

## Important notes
1. If you make changes to server.js, kill the terminal and re-run "npm start" to load those changes.
2. If the DB connection is not working, make sure you are on VPN or Villanova Wi-Fi.
3. Changes in Visual Studio Code are not automatically saved in the remote repository. There are a lot of resources online about working with git commands through Visual Studio Code. You can also make branches to collaborate with teammates.

## Clone the repository
1. In the repository, click <> Code above.
2. Copy the HTTPS URL for the repository.
3. Open Visual Studio Code.
4. Click "Clone Git Repository" and paste the copied URL.
5. Select a repository location.
6. Open the repository you have just cloned.

Note: If you're signing in to GitHub from Visual Studio for the first time, you may need to authorize your account by configuring your username and password before pushing and pulling changes. Run each of these lines individually in the Visual Studio Code terminal. When you run git commit or git push, it may ask you to verify your account.
```
git config --global user.email your-github-account-email@gmail.com
git config --global user.name your-github-account-username
```

[Download Visual Studio Code - Mac, Linux, Windows](https://code.visualstudio.com/download)

## To download nodejs and connect it to OracleDB locally
Set-Up Help: https://node-oracledb.readthedocs.io/en/latest/user_guide/installation.html

Connection String Help: https://node-oracledb.readthedocs.io/en/latest/user_guide/connection_handling.html#connectionstrings

### ON MAC 
1. Install NodeJS from [nodejs.org](https://nodejs.org/en)

2. Install all dependencies  using the node package manager, which is included in Node.js:
```
npm i
```
3. Install the free Oracle Instant Client ‘Basic’ package.
Download the Basic 64-bit DMG from [Oracle Technology Network](https://www.oracle.com/database/technologies/instant-client/macos-intel-x86-downloads.html)

4. Or install Oracle Instant Client (Scripted installation). Open the terminal and run the following commands:
```
cd $HOME
curl -O https://download.oracle.com/otn_software/mac/instantclient/198000/instantclient-basic-macos.x64-19.8.0.0.0dbru.dmg
hdiutil mount instantclient-basic-macos.x64-19.8.0.0.0dbru.dmg
/Volumes/instantclient-basic-macos.x64-19.8.0.0.0dbru/install_ic.sh
hdiutil unmount /Volumes/instantclient-basic-macos.x64-19.8.0.0.0dbru
```

_The Instant Client directory will be $HOME/instantclient_19_8._

5. Run one of the examples, such as seeListings.js:
```
node seeListings.js 
```
### ON WINDOWS
1. Install NodeJS
Install the 64-bit Node.js MSI (e.g. node-v14.17.0-x64.msi) from [nodejs.org](https://nodejs.org/en).

2. Install node-oracledb using the npm package manager, which is included in Node.js:
```
npm install oracledb
```
3. Install the free Oracle Instant Client ZIP
Download the free 64-bit Instant Client Basic ZIP file from [Oracle Technology Network](https://www.oracle.com/database/technologies/instant-client/winx64-64-downloads.html)

4. Unzip the ZIP file into a directory that is accessible to your application.

For example unzip instantclient-basic-windows.x64-19.11.0.0.0dbru.zip to C:\oracle\instantclient_19_11.

5. Run one of the examples, such as seeListings.js:
```
node seeListings.js
```

## To run the project
1. Ensure the database is created in SQLDeveloper on your Villanova repository. See the "create_db" folder for the SQL and inserts.
2. Ensure the repository is cloned in Visual Studio Code and Oracle Instant Client is downloaded. Follow the sections above to do so.
3. Make sure you are on the Villanova network, or connect to the VPN before starting the program.
4. Open a new terminal in Visual Studio Code and run "npm start." The console should read "Server started at http://localhost:8080" and
"Oracle connection established" if both the UI has been served locally and the Oracle connection is successfully established.
5. Open http://localhost:8080 and you should see the UI of your application load.

[Working with git in Visual Studio Code](https://code.visualstudio.com/docs/sourcecontrol/overview)

[Git Remote: Synching local changes with remote repository](https://www.atlassian.com/git/tutorials/syncing)

## Helpful Links
1. [Set Up a Simple Node Server Project](https://levelup.gitconnected.com/set-up-and-run-a-simple-node-server-project-38b403a3dc09)
2. [Download Visual Studio Code - Mac, Linux, Windows](https://code.visualstudio.com/download)
3. [Using Git source control in VS Code](https://code.visualstudio.com/docs/sourcecontrol/overview)
