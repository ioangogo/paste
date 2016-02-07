# License
This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version. This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for more details. You should have received a copy of the GNU General Public License along with this program. If not, see <http://www.gnu.org/licenses/>.

# Description 
A simple pastebin clone written in Node.js. It requires a MySQL backend. 

# Screenshot

![Graph](http://i.imgur.com/VazVQcw.png)

# How to run in Docker

After this repository is cloned, modify the Dockerfile and replace "my-docker-machine-ip" with your Docker Machine IP. Keep the /paste.
```
ENV SITE_NAME "http://my-docker-machine-ip/paste"
```
Next, you can spin up the application with a test database with the docker-compose.yml file.

```
docker-compose build
docker-compose up
docker-compose start
```
When complete, you can login with your browser to http://docker-machine-ip/paste . Replace "docker-machine-ip" with the actual IP for Docker.

# Pasting with curl from the terminal
```
curl http://docker-machine-ip/paste/newpaste?text=Hello
```

# Viewing pastes with curl from the terminal with an ID
```
curl http://docker-machine-ip/paste/show?id=XXXXXXXXXX
```
