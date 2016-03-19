GENERATED_FILES = \
	ny.json

all: $(GENERATED_FILES)

.PHONY: clean all

clean:
	rm -rf -- $(GENERATED_FILES) build

build/tl_2012_%_tract.zip:
	mkdir build
	curl -o $@ 'http://www2.census.gov/geo/tiger/TIGER2012/TRACT/$(notdir $@)'

build/tracts.shp: build/tl_2012_36_tract.zip
	rm -rf $(basename $@)
	mkdir -p $(basename $@)
	unzip -d $(basename $@) $<
	for file in $(basename $@)/*; do chmod 644 $$file; mv $$file $(basename $@).$${file##*.}; done
	rmdir $(basename $@)
	touch $@

ny.json: build/tracts.shp
	node_modules/.bin/topojson -o $@ --q0=0 --simplify=1 --projection='d3.geo.mercator().center([-75.819, 42.795]).scale(6193).translate([480, 350]).precision(0)' --id-property=TRACTCE -- $(filter %.shp,$^)
