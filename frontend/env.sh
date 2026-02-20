rm -rf /usr/share/nginx/html/env-config.js
touch /usr/share/nginx/html/env-config.js

echo "window.__env__ = {" >> /usr/share/nginx/html/env-config.js
echo "  VITE_API_BASE_URL: \"${VITE_API_BASE_URL}\"" >> /usr/share/nginx/html/env-config.js
echo "};" >> /usr/share/nginx/html/env-config.js
