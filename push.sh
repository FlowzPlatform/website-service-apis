#!/bin/sh
###########################
cd websites
# switch to branch you want to use
git checkout PublishedWebsites
# add all added/modified files
git add .
# commit changes
git commit -am "Changes Made to website"
# push to git remote repository
git push
###########################
echo Press Enter...
read