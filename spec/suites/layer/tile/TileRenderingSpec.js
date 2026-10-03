describe('tile rendering during animated zoom', function () {
	var container, map;

	beforeEach(function () {
		container = createContainer('800px', '600px');
		map = L.map(container, {zoomAnimation: true});
	});

	afterEach(function () {
		removeMapContainer(map, container);
	});

	[
		[11, 14, {}, 14],
		[14, 11, {}, 11],
		[11, 14, {maxNativeZoom: 13}, 13],
		[14, 11, {minNativeZoom: 12}, 12]
	].forEach(function (test) {
		var start = test[0], target = test[1], options = test[2], tileZoom = test[3];
		it('loads target tiles before the map advances from ' + start + ' to ' + target + ' (tile zoom ' + tileZoom + ')', function () {
			map.setView([0, 0], start);
			var grid = L.gridLayer(options).addTo(map);
			var checked = false;
			map.on('zoomanim', function () {
				expect(map.getZoom()).to.equal(start);
				expect(grid._tileZoom).to.equal(tileZoom);
				expect(Object.keys(grid._tiles).some(function (key) {
					return grid._tiles[key].coords.z === tileZoom;
				})).to.be(true);
				checked = true;
			});

			map._animateZoom(map.getCenter(), target, true);
			expect(checked).to.be(true);
		});
	});
});
