from datetime import date
import tornado.escape
import tornado.ioloop
import tornado.web
import mysql.connector
from mysql.connector import errorcode

cnx = mysql.connector.connect(user='root', passwd='morrissey', database='leaderboard')
cursor = cnx.cursor()

query = ("SELECT name, score FROM Players")

class VersionHandler(tornado.web.RequestHandler):
	def get(self):
		response = { 'version': '3.5.1',
					 'last_build':  date.today().isoformat() }
		self.write(response)
 
class GetLeaderboard(tornado.web.RequestHandler):
	def get(self):
		cursor.execute(query)
		response = {}
		for(name, score) in cursor:
			response[name] = score
		self.write(response);
		
class SetLeaderboard(tornado.web.RequestHandler):
	def post(self, id):
		response = {}
		self.write(response)
		
application = tornado.web.Application([
	(r"/version", VersionHandler),
	(r"/leaderboard", GetLeaderboard)
])
 
if __name__ == "__main__":
	application.listen(8000)
	tornado.ioloop.IOLoop.instance().start()