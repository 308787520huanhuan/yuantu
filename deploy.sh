mkdir -p /root/platform
tar -xzf  /root/package.tgz  -C /root/platform
cd /root/platform
forever stop platform.js
forever start platform.js