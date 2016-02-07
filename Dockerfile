FROM ubuntu
RUN apt-get update;apt-get install -y nodejs npm
EXPOSE 8080
ENV PORT 8080 
ENV SITE_NAME "http://192.168.99.100:8080"
ENV PASSWORD "paste"
ENV MYSQL_URI "mysql://root:sql@mysql:3306/"
CMD cd /paste;npm install --no-bin-links;sleep infinity
