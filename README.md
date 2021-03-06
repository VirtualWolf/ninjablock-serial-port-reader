# NinjaBlock Serial Port Reader
Since the demise of the company behind Ninja Blocks and their "Cloud" platform being up and down, I needed a way to continue sending the temperature data from my Ninja Block [to my website](https://virtualwolf.org/weather). I had originally added some code to the `ninjablock` service that runs on the Ninja Block itself to post new data, but that was occasionally unreliable as well.

As it turns out, it's dead simple to read directly from the serial port on the Ninja Block, at `/dev/ttyO1`, and parse and send the data from there. This is a very simple Node.js application to do just that.

# Installation
*Note*: This is all on the assumption that the Ninja Block is a BeagleBone White, not Black, and is on Node.js v0.8.x (hence the ancient dependencies for everything). Black might work but that's not what I have.

1. Upgrade `npm` for support for '^' in version requirements: `sudo npm install -g npm@1.3.17`
2. Install the two dependencies: `npm install`
3. Edit `index.js` and enter your device ID(s) on line 23 and the endpoint to post to on line 28
4. Shut down the `ninjablock` service: `sudo service ninjablock stop`
5. Run the application: `npm start`

Set the environment variable `DEBUG=true` to print the data received to the console.

# Running as a service
To run this as a service automatically on startup instead of the default Ninja Block one, edit the Upstart script at `/etc/init/ninjablock.conf` and replace its contents with the following:

    description "Ninja Blocks v0.8"
    author      "http://www.ninjablocks.com"
 
    start on filesystem and net-device-up IFACE!=lo
    stop on shutdown
 
    respawn
 
    script
        chdir /home/ubuntu/ninjablock-serial-port-reader
        exec /usr/bin/node index.js
    end script

Substitute the path in the `chdir` statement to wherever you've cloned the repository to. Then to start and stop it, use `sudo service ninjablock start` and `sudo service ninjablock stop`.