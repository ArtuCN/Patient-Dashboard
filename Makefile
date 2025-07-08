CONTAINER_NAME=my_react_app

dev:
	cd my_react_app && npm install
	cd my_react_app && npm start

prod:
	cd my_react_app && npm install
	cd my_react_app && npm run build

clean:
	rm -rf my_react_app/node_modules
	rm -rf my_react_app/build
