virtualenv:
	virtualenv --py=python2.7 venv

devserver:
	python manage.py runserver

migrate:
	python manage.py makemigrations
	python manage.py migrate

heroku_migrate:
	heroku run -a sketchfiddle python manage.py migrate
