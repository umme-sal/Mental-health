EC2
view running instance
ubuntu
click ssh,http,https
key value pair
create

//add custom port
security
security group
edit
inbound rules
add rules
3000 + source(anywhere ipv4)
save rules

//the connect
click connect

if it block then connet through cloudshell

cloudshell
upload file
key value.pem
//permission update
chmod 400 key_value.pem
ssh -i key_value.pem ubuntu@ipaddress

sudo apt update -y
sudo apt install git, nodejs
sudo apt install npm
git clone url

//go to url directory
cd mental-health
ls
npm install
node server.js

