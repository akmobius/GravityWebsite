import tornado.ioloop

import tornado.web

class MainHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, world")

class ArielHandler(tornado.web.RequestHandler):
    def get(self):
        self.write("Hello, Ariel")

class TestHandler(tornado.web.RequestHandler):
    def get(self):
        self.write('<html><body><p>Input your name</p><form action="/test" method="POST">'
                   '<input type="text" name="yourname">'
                   '<input type="submit" value="Submit">'
                   '</form></body></html>')

    def post(self):
        self.set_header("Content-Type", "text/plain")
        self.write("You wrote " + self.get_body_argument("yourname"))

def make_app():
    return tornado.web.Application([
        (r"/", MainHandler),
        (r"/ariel", ArielHandler),
        (r"/test", TestHandler),
    ])

if __name__ == "__main__":
    app = make_app()
    app.listen(80)
    tornado.ioloop.IOLoop.current().start()