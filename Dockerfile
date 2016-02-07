FROM ubuntu
RUN apt-get update;apt-get install -y nodejs npm
EXPOSE 888
ENV PORT 888 
ENV SITE_NAME "https://my-docker-machine-ip/paste"
ENV PASSWORD "paste"
ENV MYSQL_URI "mysql://root:sql@mysql:3306/"
ADD * /
CMD cd /;npm install --no-bin-links;nodejs /main.js
