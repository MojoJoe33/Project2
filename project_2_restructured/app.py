from flask import Flask, jsonify, render_template
app = Flask(__name__)

@app.route("/")
def home():
    return render_template('home.html')

@app.route("/genre")
def genre():
    return render_template('genres.html')

@app.route("/platforms")
def platforms():
    return render_template('platform.html')

@app.route("/publisher")
def publisher():
    return render_template('publisher.html')

@app.route("/sales")
def sales():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
