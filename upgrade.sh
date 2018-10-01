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
    SERVICE_NAME="$SERVICE_NAME_MASTER";
    BACKEND_HOST="$BACKEND_HOST_MASTER";
    RDB_HOST="$RDB_HOST_MASTER";
    RDB_PORT="$RDB_PORT_MASTER";
    PORT1="$PORT1_MASTER";
    PORT2="$PORT2_MASTER";
    PORT3="$PORT3_MASTER";
    PORT4="$PORT4_MASTER";
    DATAVOLUMES="$DATAVOLUMES_MASTER";
    VOLUMEDRIVER="$VOLUMEDRIVER_MASTER";
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
      SERVICE_NAME="$SERVICE_NAME_DEVELOP";
      BACKEND_HOST="$BACKEND_HOST_DEVELOP";
      RDB_HOST="$RDB_HOST_DEVELOP";
      RDB_PORT="$RDB_PORT_DEVELOP";
      PORT1="$PORT1_DEVELOP";
      PORT2="$PORT2_DEVELOP";
      PORT3="$PORT3_DEVELOP";
      PORT4="$PORT4_DEVELOP";
      DATAVOLUMES="$DATAVOLUMES_DEVELOP";
      VOLUMEDRIVER="$VOLUMEDRIVER_DEVELOP";
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
      SERVICE_NAME="$SERVICE_NAME_STAGING";
      BACKEND_HOST="$BACKEND_HOST_STAGING";
      RDB_HOST="$RDB_HOST_STAGING";
      RDB_PORT="$RDB_PORT_STAGING";
      PORT1="$PORT1_STAGING";
      PORT2="$PORT2_STAGING";
      PORT3="$PORT3_STAGING";
      PORT4="$PORT4_STAGING";
      DATAVOLUMES="$DATAVOLUMES_STAGING";
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
      SERVICE_NAME="$SERVICE_NAME_QA";
      BACKEND_HOST="$BACKEND_HOST_QA";
      RDB_HOST="$RDB_HOST_QA";
      RDB_PORT="$RDB_PORT_QA";
      PORT1="$PORT1_QA";
      PORT2="$PORT2_QA";
      PORT3="$PORT3_QA";
      PORT4="$PORT4_QA";
      DATAVOLUMES="$DATAVOLUMES_QA";
      VOLUMEDRIVER="$VOLUMEDRIVER_QA";
  }
fi

SERVICE_ID=`curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" -X GET -H 'Accept: application/json' -H 'Content-Type: application/json' "$RANCHER_URL/v2-beta/projects/$ENV_ID/services?name=$SERVICE_NAME" | jq '.data[].id' | tr -d '"'`
echo $SERVICE_ID

curl -u ""$RANCHER_ACCESSKEY":"$RANCHER_SECRETKEY"" \
-X POST \
-H 'Accept: application/json' \
-H 'Content-Type: application/json' \
-d '{
     "inServiceStrategy":{"launchConfig": {"imageUuid":"docker:'$USERNAME'/flowz_service_api_backend_flowz:'$TAG'","kind": "container","labels":{"io.rancher.container.pull_image": "always","io.rancher.scheduler.affinity:host_label": "'"$BACKEND_HOST"'"},"volumeDriver": "'"$VOLUMEDRIVER"'","dataVolumes": ["'"$DATAVOLUMES"'"],"environment": {"RDB_HOST": "'"$RDB_HOST"'","RDB_PORT": "'"$RDB_PORT"'","REGISTER_URL":"'"$REGISTER_URL"'","EMAIL_URL":"'"$EMAIL_URL"'","domainKey": "'"$DOMAINKEY"'","dnsServer1": "'"$DNSSERVER1"'","dnsServer2": "'"$DNSSERVER2"'","webrootServer": "'"$WEBROOTSERVER"'","serverARecord": "'"$SERVERARECORD"'","MONGODB": "'"$MONGODB"'"},"healthCheck": {"type": "instanceHealthCheck","healthyThreshold": 2,"initializingTimeout": 60000,"interval": 2000,"name": null,"port": 3032,"recreateOnQuorumStrategyConfig": {"type": "recreateOnQuorumStrategyConfig","quorum": 1},"reinitializingTimeout": 60000,"responseTimeout": 60000,"strategy": "recreateOnQuorum","unhealthyThreshold": 3},"networkMode": "managed"}},"toServiceStrategy":null}' \
$RANCHER_URL/v2-beta/projects/$ENV_ID/services/$SERVICE_ID?action=upgrade
