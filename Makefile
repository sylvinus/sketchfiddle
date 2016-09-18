virtualenv:
	virtualenv --py=python2.7 venv

devserver:
	python manage.py runserver --nostatic
