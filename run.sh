#!/bin/bash

./front_run.sh &

./back_run.sh &

./azurite_run.sh &

./func_run.sh &

wait