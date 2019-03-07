set -x
set -e

appcenter codepush release-react -a Homedruid/Homedruid-Android -t "<=4.1.0"  -d Production --description "$1"
