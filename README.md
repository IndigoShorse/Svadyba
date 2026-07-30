# Svadyba

Простая страница свадебного приглашения, которую можно запустить локально для превью.

## Русский

### Что нужно
- Современный браузер
- Python 3.10+ (рекомендуется 3.11 или 3.12)
- Локальный веб-сервер (самый простой вариант — встроенный HTTP-сервер Python)

### Как запустить локально
1. Откройте папку проекта:
   ```bash
   cd /path/to/Svadyba
   ```
2. Запустите локальный сервер:
   ```bash
   python -m http.server 8000
   ```
3. Откройте страницу в браузере:
   - http://127.0.0.1:8000/
   - или http://localhost:8000/

### Примечания
- Для проекта не требуется сборка.
- Для локальной разработки рекомендуется использовать Python-окружение (venv).
- Виртуальное окружение не стоит добавлять в систему контроля версий.
- Если вы используете venv, создайте его так:
  ```bash
  python -m venv .venv
  ```
  и активируйте перед запуском сервера.

### Структура проекта
- index.html — главная страница
- styles/ — таблицы стилей
- scripts/ — JavaScript-логика
- data/ — данные приглашения

---

## English

A simple wedding invitation page that can be launched locally for preview.

### What you need
- A modern web browser
- Python 3.10+ (recommended: 3.11 or 3.12)
- A local web server (the simplest option is Python's built-in HTTP server)

### Run locally
1. Open the project folder:
   ```bash
   cd /path/to/Svadyba
   ```
2. Start a local server:
   ```bash
   python -m http.server 8000
   ```
3. Open the page in your browser:
   - http://127.0.0.1:8000/
   - or http://localhost:8000/

### Notes
- The project does not require a build step.
- It is recommended to use a Python environment (venv) for local development.
- Do not commit the virtual environment to version control.
- If you use a venv, create it with:
  ```bash
  python -m venv .venv
  ```
  and activate it before running the server.

### Project structure
- index.html — main page
- styles/ — stylesheets
- scripts/ — JavaScript logic
- data/ — invitation data
