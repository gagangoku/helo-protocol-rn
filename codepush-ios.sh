set -x
set -e

appcenter codepush release-react -a Helo-Protocol/Helo-Cust-IOS -t "<=1.1.0"  -d Production --description "$1"
