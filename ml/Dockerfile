# Use the official Python 3.10 image as a parent image
FROM python:3.10

# Set the working directory to /code
WORKDIR /code

# Copy the current directory contents into the container at /code
COPY ./requirements.txt /code/requirements.txt
COPY ./requirements-pinecone.txt /code/requirements-pinecone.txt

# Install any needed packages specified in requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements.txt
RUN pip install --no-cache-dir --upgrade -r /code/requirements-pinecone.txt

# Copy the rest of the working directory contents into the container at /code
COPY . /code

# Change permissions to allow the Hugging Face user to write to the local directory (if needed)
RUN chmod -R 777 /code

# Define environment variables
ENV HOST=0.0.0.0
# Hugging Face Spaces expose port 7860
ENV PORT=7860
ENV RAG_PORT=7860

# Expose the API port
EXPOSE 7860

# Start the application
CMD ["uvicorn", "rag_server:app", "--host", "0.0.0.0", "--port", "7860"]