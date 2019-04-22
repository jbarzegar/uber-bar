#!/bin/bash

DIRNAME=$(dirname $0)

cd $dirname
echo $dirname

$npm_execpath build
