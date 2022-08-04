/**
 * @format
 */

 const {spawnSync} = require('child_process');
 const chalk = require('chalk');
 
 const paths = require('./paths');
 
 const message = msg => {
   // noinspection JSUnresolvedFunction
   return chalk.green(msg);
 };
 
 // setup pod if we are on MacOS
 if (process.platform === 'darwin') {
   console.log(message('Setting up CocoaPods'));
 
   const setPath = spawnSync('bundle', ['config', '--local', 'path', '.bundle/vendor/bundle'], {
     cwd: paths.appDirectory,
     stdio: 'inherit',
   });
 
   if (setPath.status) {
     // no-op
     // most likely we can still proceed, shouldn't has problem, skip error
   }
 
   const bundle = spawnSync('bundle', ['install'], {
     cwd: paths.appDirectory,
     stdio: 'inherit',
   });
 
   if (bundle.status) {
     process.exit(bundle.status);
   }
 
   const pod = spawnSync('bundle', ['exec', 'pod', 'install'], {
     cwd: paths.iosDirectory,
     stdio: 'inherit',
   });
 
   if (pod.status) {
     console.log(message('pod install failed, try again with --repo-update'));
     //if pod failed, we try again with with repo update
     const podUpdate = spawnSync('bundle', ['exec', 'pod', 'install', '--repo-update'], {
       cwd: paths.iosDirectory,
       stdio: 'inherit',
     });
 
     if (podUpdate.status) {
       process.exit(podUpdate.status);
     }
   }
 } else {
   console.log(message('Non-MacOS, Skipped CocoaPods setup for iOS'));
 }
 
 console.log(message('\nSetting AndroidX'));
 
 const jetify = spawnSync('npx', ['jetify'], {
   cwd: paths.appDirectory,
   stdio: 'inherit',
 });
 
 if (jetify.status) {
   process.exit(jetify.status);
 }
