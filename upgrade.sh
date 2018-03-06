if [ "$TRAVIS_BRANCH" = "master" ]
then
    {
    echo "call $TRAVIS_BRANCH branch"
    ENV_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects?name=Production" | jq '.data[].id' | tr -d '"'`
    echo $ENV_ID
    USERNAME="$DOCKER_USERNAME_FLOWZ";
    TAG="latest";
    REGISTER_URL="$REGISTER_URL_MASTER";
    EMAIL_URL="$EMAIL_URL_MASTER";
    DOMAINKEY="$DOMAINKEY_MASTER";
    WEBROOTSERVER="$WEBROOTSERVER_MASTER";
    SERVERARECORD="$SERVERARECORD_MASTER";
  }
elif [ "$TRAVIS_BRANCH" = "develop" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects?name=Develop" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="dev";
      REGISTER_URL="$REGISTER_URL_DEVELOP";
      EMAIL_URL="$EMAIL_URL_DEVELOP";
      DOMAINKEY="$DOMAINKEY_DEVELOP";
      WEBROOTSERVER="$WEBROOTSERVER_DEVELOP";
      SERVERARECORD="$SERVERARECORD_DEVELOP";
  }
elif [ "$TRAVIS_BRANCH" = "staging" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects?name=Staging" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="staging";
      REGISTER_URL="$REGISTER_URL_STAGING";
      EMAIL_URL="$EMAIL_URL_STAGING";
      DOMAINKEY="$DOMAINKEY_STAGING";
      WEBROOTSERVER="$WEBROOTSERVER_STAGING";
      SERVERARECORD="$SERVERARECORD_STAGING";
  }  
else
  {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects?name=QA" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="qa";
      REGISTER_URL="$REGISTER_URL_QA";
      EMAIL_URL="$EMAIL_URL_QA";
      DOMAINKEY="$DOMAINKEY_QA";
      WEBROOTSERVER="$WEBROOTSERVER_QA";
      SERVERARECORD="$SERVERARECORD_QA";
  }
fi

SERVICE_ID=`curl -u ""$RANCHER_USER":"$RANCHER_PASS"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services?name=service-api-backend-flowz" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID

curl -u ""$RANCHER_USER":"$RANCHER_PASS"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
     "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$USERNAME'/flowz_service_api_backend_flowz:'$TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=webbuilder-root"},"ports": ["3032:3032/tcp","4032:4032/tcp","80:80/tcp","443:443/tcp"],"dataVolumes": ["/data:/var/www/html/websites"],"environment": {"RDB_HOST": "'"$RDB_HOST"'","RDB_PORT": "'"$RDB_PORT"'","REGISTER_URL":"'"$REGISTER_URL"'","EMAIL_URL":"'"$EMAIL_URL"'","domainKey": "'"$DOMAINKEY"'","dnsServer1": "'"$dnsServer1"'","webrootServer": "'"$WEBROOTSERVER"'","serverARecord": "'"$SERVERARECORD"'"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3032,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
http://rancher.flowz.com:8080/v2-beta/projects/$ENV_ID/services/$SERVICE_ID?action=upgrade
