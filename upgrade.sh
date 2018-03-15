if [ "$TRAVIS_BRANCH" = "master" ]
then
    {
    echo "call $TRAVIS_BRANCH branch"
    ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_MASTER":"$RANCHER_SECRETKEY_MASTER"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_MASTER/v2-beta/projects?name=Production" | jq '.data[].id' | tr -d '"'`
    echo $ENV_ID
    USERNAME="$DOCKER_USERNAME_FLOWZ";
    TAG="latest";
    REGISTER_URL="$REGISTER_URL_MASTER";
    EMAIL_URL="$EMAIL_URL_MASTER";
    DOMAINKEY="$DOMAINKEY_MASTER";
    WEBROOTSERVER="$WEBROOTSERVER_MASTER";
    SERVERARECORD="$SERVERARECORD_MASTER";
    DNSSERVER1="$DNSSERVER1_MASTER";
    DNSSERVER2="$DNSSERVER2_MASTER";
    MONGODB="$MONGODB_MASTER";
    RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_MASTER";
    RANCHER_SECRETKEY="$RANCHER_SECRETKEY_MASTER";
    RANCHER_URL="$RANCHER_URL_MASTER";
  }
elif [ "$TRAVIS_BRANCH" = "develop" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_DEVELOP":"$RANCHER_SECRETKEY_DEVELOP"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_DEVELOP/v2-beta/projects?name=Develop" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="dev";
      REGISTER_URL="$REGISTER_URL_DEVELOP";
      EMAIL_URL="$EMAIL_URL_DEVELOP";
      DOMAINKEY="$DOMAINKEY_DEVELOP";
      WEBROOTSERVER="$WEBROOTSERVER_DEVELOP";
      SERVERARECORD="$SERVERARECORD_DEVELOP";
      DNSSERVER1="$DNSSERVER1_DEVELOP";
      DNSSERVER2="$DNSSERVER2_DEVELOP";
      MONGODB="$MONGODB_DEVELOP";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_DEVELOP";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_DEVELOP";
      RANCHER_URL="$RANCHER_URL_DEVELOP";
  }
elif [ "$TRAVIS_BRANCH" = "staging" ]
then
    {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_STAGING":"$RANCHER_SECRETKEY_STAGING"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_STAGING/v2-beta/projects?name=Staging" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="staging";
      REGISTER_URL="$REGISTER_URL_STAGING";
      EMAIL_URL="$EMAIL_URL_STAGING";
      DOMAINKEY="$DOMAINKEY_STAGING";
      WEBROOTSERVER="$WEBROOTSERVER_STAGING";
      SERVERARECORD="$SERVERARECORD_STAGING";
      DNSSERVER1="$DNSSERVER1_STAGING";
      DNSSERVER2="$DNSSERVER2_STAGING";
      MONGODB="$MONGODB_STAGING";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_STAGING";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_STAGING";
      RANCHER_URL="$RANCHER_URL_STAGING";
  }  
else
  {
      echo "call $TRAVIS_BRANCH branch"
      ENV_ID=`curl -u ""$RANCHER_ACCESSKEY_QA":"$RANCHER_SECRETKEY_QA"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL_QA/v2-beta/projects?name=QA" | jq '.data[].id' | tr -d '"'`
      echo $ENV_ID
      USERNAME="$DOCKER_USERNAME";
      TAG="qa";
      REGISTER_URL="$REGISTER_URL_QA";
      EMAIL_URL="$EMAIL_URL_QA";
      DOMAINKEY="$DOMAINKEY_QA";
      WEBROOTSERVER="$WEBROOTSERVER_QA";
      SERVERARECORD="$SERVERARECORD_QA";
      DNSSERVER1="$DNSSERVER1_QA";
      DNSSERVER2="$DNSSERVER2_QA";
      MONGODB="$MONGODB_QA";
      RANCHER_ACCESSKEY="$RANCHER_ACCESSKEY_QA";
      RANCHER_SECRETKEY="$RANCHER_SECRETKEY_QA";
      RANCHER_URL="$RANCHER_URL_QA";
  }
fi

SERVICE_ID=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=service-api-backend-flowz" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID

curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
     "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$USERNAME'/flowz_service_api_backend_flowz:'$TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "machine=webbuilder-root"},"ports": ["3032:3032/tcp","4032:4032/tcp","80:80/tcp","443:443/tcp"],"volumeDriver": "rancher-nfs","dataVolumes": ["data:/var/www/html/websites"],"environment": {"RDB_HOST": "'"$RDB_HOST"'","RDB_PORT": "'"$RDB_PORT"'","REGISTER_URL":"'"$REGISTER_URL"'","EMAIL_URL":"'"$EMAIL_URL"'","domainKey": "'"$DOMAINKEY"'","dnsServer1": "'"$DNSSERVER1"'","dnsServer2": "'"$DNSSERVER2"'","webrootServer": "'"$WEBROOTSERVER"'","serverARecord": "'"$SERVERARECORD"'","MONGODB": "'"$MONGODB"'"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3032,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID?action=upgrade
