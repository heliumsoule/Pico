import sys
sys.path.append('proto')

import lutorpy as Lua
lua.LuaRuntime(zero_based_index=True)
require('torch')
require('nn')
require('cutorch')
require('cunn')
require('cudnn')
require('neural_style')


import neural_contract_pb2 as neural_server
import time
_ONE_DAY_IN_SECONDS = 60 * 60 * 24

require('neural_style')

class Style_Server_Handler(neural_server.BetaImageStyleServerServicer):
	def __init__(self):
		self.model = neural_style.loadModel()

	def styleImage(self, request, context):
		response = neural_server.style_img()
		response.name = "Input image name here"
		response.aws_link = "Input aws link here"
		response.style = "Input image style here"
		
		return response

class Style_Server(object):
	def __init__(self, handler):
		self.server = neural_server.beta_create_ImageStyleServer_server(handler)
		self.server.add_insecure_port('[::]:8000')

	def serve(self):
		self.server.start()
		try:
			while True:
				time.sleep(_ONE_DAY_IN_SECONDS)
		except KeyboardInterrupt:
				self.server.stop(0)

if __name__ == "__main__":
	neural_server = Style_Server(Style_Server_Handler())
	neural_server.serve()

