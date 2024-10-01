set -e
if [[ $1 == 'generate' ]]; then
	yarn generate
elif [[ $1 == 'build' ]]; then
	yarn build
elif [[ $1 == 'check-yarn-version' ]]; then
  yarnVersion=$(yarn --version)
  if [[ $yarnVersion != '4.0.1' ]]; then
    echo -e "\e[31mYarn version must be at least 4.0.1, current version is $yarnVersion\e[0m"
    echo -e "\e[31mPlease install with: yarn set version 4.0.1\e[0m"
    exit 1
  fi