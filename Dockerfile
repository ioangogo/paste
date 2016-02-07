FROM ubuntu
RUN apt-get update;apt-get install -y nodejs npm
EXPOSE 8080
ENV PORT 8080
ENV SITE_NAME "http://my-docker-machine-ip/paste"
ENV PASSWORD "paste"
ENV MYSQL_URI "mysql://root:sql@mysql:3306/"
ADD * /
CMD cd /;npm install;nodejs /main.js
