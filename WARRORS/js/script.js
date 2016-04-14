    function drawGrahpics() {

        var margin = {
                top: 90,
                right: 160,
                bottom: 30,
                left: 50
            },
            width = 1200 - margin.left - margin.right,
            height = 700 - margin.top - margin.bottom;

        var speed = 500;

        var x = d3.scale.linear()
            .range([0, width]);

        var y = d3.scale.linear()
            .range([0, height]);

        var color = d3.scale.category10();


        var xAxis = d3.svg.axis()
            .scale(x)
            .tickSize(0)
            .ticks(30)
            .orient("top");

        var xtickLabels = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6',
            'Week 7', 'Week 8', 'Week 9', 'Week 10', 'Week 11', 'Week 12', 'Week 13',
            'Week 14', 'Week 15', 'Week 16', 'Week 17', 'Week 18', 'Week 19', 'Week 20',
            'Week 21', 'Week 22', 'Week 23', 'Week 24', 'Week 25'
        ];

        xAxis.tickFormat(function (d, i) {
            return xtickLabels[i];
        });

        var yAxis = d3.svg.axis()
            .scale(y)
            .tickFormat(function (d) {
                return d;
            })
            .ticks(15)
            .innerTickSize(-width)
            .tickPadding(10)
            .outerTickSize(0)
            .orient("left");


        var line = d3.svg.line()
            .x(function (d) {
                return x(d.week);
            })
            .y(function (d) {
                return y(d.rank);
            });


        var svg = d3.select("#graphic")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .call(responsivefy)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var clip = svg.append("clipPath")
            .attr("id", "clip")
            .append("rect")
            .attr("x", "-5")
            .attr("y", "-20")
            .attr("width", 0)
            .attr("height", height * 1.2);

        d3.csv("data/rankdata.csv", function (error, data) {

            color.domain(d3.keys(data[0])
                .filter(function (key) {
                    return key !== "week";
                }));

            data.forEach(function (d) {
                d.week = +[d.week];
            });


            var teams = color.domain()
                .map(function (name) {
                    return {
                        name: name,
                        values: data.map(function (d) {
                            return {
                                name: name,
                                week: d.week,
                                rank: +d[name]
                            };
                        })
                    };
                });


            x.domain(d3.extent(data, function (d) {
                return d.week;
            }));


            y.domain([
                d3.min(teams, function (c) {
                    return d3.min(c.values, function (v) {
                        return v.rank;
                    });
                }),
                d3.max(teams, function (c) {
                    return d3.max(c.values, function (v) {
                        return v.rank;
                    });
                })
            ].reverse());


            svg.append("g")
                .attr("class", "x axis")
                .attr("transform", "translate(0,0)")
                .call(xAxis)
                .selectAll("text")
                .style("text-anchor", "start")
                .attr("dx", "2.3em")
                .attr("dy", "-0.9em")
                .attr("transform", function (d) {
                    return "rotate(-60)";
                });

            svg.append("g")
                .attr("class", "y axis")
                .call(yAxis);

            //timeline
            svg.append("line")
                .attr({
                    "class": "horizontalGrid",
                    "x1": -2,
                    "x2": width,
                    "y1": y(1) - 13,
                    "y2": y(1) - 13,
                    "fill": "none",
                    "shape-rendering": "crispEdges",
                    "stroke": "#e0e1e1",
                    "stroke-width": "1.2px",
                    "stroke-dasharray": ("3, 3")
                })
                .attr("id", "dotted")
                .attr("clip-path", function (d) {
                    return "url(#clip)";
                });

            //end of timeline
            var teams = svg.selectAll(".team")
                .data(teams)
                .enter()
                .append("g")
                .attr("class", "team");

            function colorFilter(d) {
                if (d.name === 'Cleveland Cavaliers') {
                    return "#0252B5";
                } else if (d.name === 'Toronto Raptors') {
                    return "#0252B5";
                } else if (d.name === 'Miami Heat') {
                    return "#0252B5";
                } else if (d.name === 'Atlanta Hawks') {
                    return "#0252B5";
                } else if (d.name === 'Boston Celtics') {
                    return "#0252B5";
                } else if (d.name === 'Charlotte Hornets') {
                    return "#0252B5";
                } else if (d.name === 'Indiana Pacers') {
                    return "#0252B5";
                } else if (d.name === 'Detroit Pistons') {
                    return "#0252B5";
                } else if (d.name === 'Chicago Bulls') {
                    return "#0252B5";
                } else if (d.name === 'Washington Wizards') {
                    return "#0252B5";
                } else if (d.name === 'Orlando Magic') {
                    return "#0252B5";
                } else if (d.name === 'Milwaukee Bucks') {
                    return "#0252B5";
                } else if (d.name === 'New York Knicks') {
                    return "#0252B5";
                } else if (d.name === 'Brooklyn Nets') {
                    return "#0252B5";
                } else if (d.name === 'Philadelphia 76ers') {
                    return "#0252B5";
                } else {
                    return "#DD1C1A";
                }
            }

            var path = svg.selectAll(".team")
                .append("path")
                .attr("class", "line")
                .attr("d", function (d) {
                    return line(d.values);
                })
                .attr("clip-path", function (d) {
                    return "url(#clip)";
                })
                .style("stroke", colorFilter);

            var circleStart = teams.append("circle")
                .attr("cx", "0")
                .attr("cy", function (d) {
                    return y(d.values[0].rank);
                })
                .style("fill", colorFilter)
                .attr("r", 2);

            var circleEnd = teams.append("circle")
                .attr("cx", function (d) {
                    return x(d.values[0].week);
                })
                .attr("cy", function (d) {
                    return y(d.values[0].rank);
                })
                .style("fill", colorFilter)
                .attr("r", 3);

            var timemark = teams.append("path")
                .attr("d", d3.svg.symbol()
                    .type("triangle-up"))
                .style("fill", "gray")
                .attr("transform", function (d) {
                    return "translate(" + (x(d.values[0].week)) + "," + (y(1) - 15) + ") rotate(-30)";
                });

            var round = teams.append("circle")
                .attr("transform", function (d) {
                    return "translate(" + (x(d.values[0].week) + 15) + "," + (y(d.values[0].rank)) + ")";
                })
                .attr("x", 0)
                .attr("y", 0)
                .attr("r", 12)
                .on("mouseover", function (d) {
                    teams.style("opacity", 0.1);
                    teams.filter(function (path) {
                            return path.name === d.name;
                        })
                        .style("opacity", 1);
                })
                .on("mouseout", function (d) {
                    teams.style("opacity", 0.1);
                })
                .style("fill", colorFilter);


            var ranking = teams.append("text")
                .attr("transform", function (d) {
                    return "translate(" + (x(d.values[0].week) + 15) + "," + (y(d.values[0].rank)) + ")";
                })
                .attr("x", 0)
                .attr("dy", ".31em")
                .attr("text-anchor", "middle")
                .on("mouseover", function (d) {
                    teams.style("opacity", 0.1);
                    teams.filter(function (path) {
                            return path.name === d.name;
                        })
                        .style("opacity", 1);
                })
                .on("mouseout", function (d) {
                    teams.style("opacity", 0.1);
                })
                .style("cursor", "pointer")
                .style("fill", "#ffffff")
                .style("font-weight", "bold")
                .text(function (d) {
                    return d.values[0].rank;
                });


            var label = teams.append("text")
                .attr("transform", function (d) {
                    return "translate(" + (x(d.values[0].week) + 20) + "," + (y(d.values[0].rank)) + ")";
                })
                .attr("x", 8)
                .attr("dy", ".31em")
                .attr("id", "label")
                .on("mouseover", function (d) {
                    teams.style("opacity", 0.1);
                    teams.filter(function (path) {
                            return path.name === d.name;
                        })
                        .style("opacity", 1);
                })
                .on("mouseout", function (d) {
                    teams.style("opacity", 1);
                })
                .style("cursor", "pointer")
                .style("stroke", colorFilter)
                .text(function (d) {
                    return d.name;
                });

            var week = 1;

            var transition = d3.transition()
                .delay(700)
                .duration(speed)
                .each("start", function start() {

                    label.transition()
                        .duration(speed)
                        .ease('linear')
                        .attr("transform", function (d) {
                            return "translate(" + (x(d.values[week].week) + 20) + "," + (y(d.values[week].rank)) + ")";
                        })
                        .text(function (d) {
                            return d.name;
                        });

                    ranking.transition()
                        .duration(speed)
                        .ease('linear')
                        .attr("transform", function (d) {
                            return "translate(" + (x(d.values[week].week) + 15) + "," + (y(d.values[week].rank)) + ")";
                        })
                        .text(function (d, i) {
                            return d.values[week].rank;
                        });

                    round.transition()
                        .duration(speed)
                        .ease('linear')
                        .attr("transform", function (d) {
                            return "translate(" + (x(d.values[week].week) + 15) + "," + (y(d.values[week].rank)) + ")";
                        });

                    circleEnd.transition()
                        .duration(speed)
                        .ease('linear')
                        .attr("cx", function (d) {
                            return x(d.values[week].week);
                        })
                        .attr("cy", function (d) {
                            return y(d.values[week].rank);
                        });

                    clip.transition()
                        .duration(speed)
                        .ease('linear')
                        .attr("width", x(week + 1) + 5)
                        .attr("height", height * 1.2);

                    timemark.transition()
                        .duration(speed)
                        .ease('linear')
                        .attr("transform", function (d) {
                            return "translate(" + (x(d.values[week].week)) + "," + (y(1) - 15) + ") rotate(-30)";
                        });
                    week += 1;
                    if (week !== data[0].length) {

                        transition = transition.transition()
                            .each("start", start);
                    }
                });

            // combined function for each team
            // ids are not necessary (just use jquery selector)
            $(".teamname")
                .on("click", function () {
                    // get the name of the team the user clicked on
                    var nameOfTeam = $(this)
                        .text();
                    // use d3 to change the style of all except for the clicked one
                    teams.style("opacity", 0.1);
                    teams.filter(function (path) {
                            return path.name === nameOfTeam;
                        })
                        .style("opacity", 1);
                });
        });

        function responsivefy(svg) {

            var container = d3.select(svg.node()
                    .parentNode),
                width = parseInt(svg.style("width")),
                height = parseInt(svg.style("height")),
                aspect = width / height;

            svg.attr("viewBox", "0 0 " + width + " " + height)
                .attr("perserveAspectRatio", "xMinYMid")
                .call(resize);

            d3.select(window)
                .on("resize." + container.attr("#graphic"), resize);

            function resize() {
                var targetWidth = parseInt(container.style("width"));
                svg.attr("width", targetWidth * 0.8);
                svg.attr("height", Math.round(targetWidth / aspect * 0.8));
            }
        }

    }
