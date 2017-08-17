#!/bin/bash

for f in ./websites/*
 do
    if [ -d "$f/layouts" ]
     then
       echo "found..."
       cp $f/layouts/index.layout $f/
       mv $f/index.layout $f/index.html
    fi
done