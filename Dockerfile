FROM python:3.9
WORKDIR /app

COPY server/requirements.txt server/server.py server/.env server/keys.json ./
RUN pip install -r ./requirements.txt
ENV GOOGLE_APPLICATION_CREDENTIALS keys.json

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "5000"]

