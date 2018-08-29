sap.ui.define(['sap/ui/core/UIComponent'], function(UIComponent) {
    "use strict";

    var Component = UIComponent.extend("sapStackedChart.Component", {

        metadata : {
            rootView : {
                "viewName": "sapStackedChart.StackedColumn",
                "type": "XML",
                "async": true
            },
            includes : ["Style.css"],
            dependencies : {
                libs : [
                    // "sap.viz",
                    // "sap.m"
                ]
            },
            config : {
                sample : {
                    stretch : true,
                    files : [
                        "StackedColumn.view.xml",
                        "StackedColumn.controller.js",
                        "InitPage.js",
                        "ChartData.json"
                    ]
                }
            }
        }
    });

    return Component;

});
