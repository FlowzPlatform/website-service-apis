FROM ubuntu:16.04

# install dependencies
RUN apt-get update \
	&& apt-get install -y --no-install-recommends \
		apache2 \
	&& rm -r /var/lib/apt/lists/*

# Default command
# CMD ["apachectl", "-D", "FOREGROUND"]

# Install Node.js
RUN apt-get update \
	&& apt-get install --yes curl
RUN curl --silent --location https://deb.nodesource.com/setup_7.x | bash -
RUN apt-get install --yes nodejs
RUN apt-get install --yes build-essential

RUN apt-get install --yes git


# add project data
WORKDIR /opt/app
ADD . /opt/app
RUN npm install


# make websites and plugins folder
RUN mkdir /var/www/html/websites
RUN mkdir /var/www/html/plugins

RUN cp -a -f /opt/app/plugins/* /var/www/html/plugins/

RUN mv /opt/app/package2.json /var/www/html/package.json


WORKDIR /var/www/html
RUN npm install

WORKDIR /opt/app
CMD service apache2 start && npm start


#RUN a2enmod rewrite
#RUN service apache2 restart

EXPOSE 80 3032 4032