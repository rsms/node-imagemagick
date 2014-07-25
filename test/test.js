var should = require('should');

describe('Array', function(){
	describe('#indexOf()', function(){
		it('should return -1 when the value is not present', function(){
			[1,2,3].indexOf(5).should.equal(-1);
			[1,2,3].indexOf(0).should.equal(-1);
		});
	});
})

suite('Array', function(){
		var arr;
		setup(function(){
			arr = [1,2,3];
		});

		suite('#indexOf()', function(){
				test('should return -1 when not present', function(){
				 arr.indexOf(4).should.equal(-1);
				 arr.indexOf(0).should.equal(-1);
		 });
		});
});