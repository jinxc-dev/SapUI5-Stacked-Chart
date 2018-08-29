sap.ui.define([
        'jquery.sap.global',
        'sap/ui/core/mvc/Controller',
        'sap/ui/model/json/JSONModel',
        'sap/viz/ui5/data/FlattenedDataset',
        'sap/viz/ui5/format/ChartFormatter',
        'sap/viz/ui5/api/env/Format',
        './InitPage',
        'sap/ui/model/SimpleType'
    ], function(jQuery, Controller, JSONModel, FlattenedDataset, ChartFormatter, Format, InitPageUtil, SimpleType) {
    "use strict";
    
    var Controller = Controller.extend("sapStackedChart.StackedColumn", {
        
        oVizFrame : null,
        oFeedValueAxis : null,
        oFeedValueAxis1  : null,
        oDataModel: null,
        jsonData:null,
        
        onInit : function (evt) {
                this.jsonData = datas;
                this.oDataModel = new JSONModel();
                this.oDataModel.setData(this.jsonData);
                this.oVizFrame = this.getView().byId("idVizFrame");
                this.oVizFrame.setVizProperties({
                    plotArea: {
                        colorPalette: d3.scale.category20().range(),
                        dataLabel: {
                            showTotal: true
                        },
                        colorPalette :  ['#f37221','green']
                    },
                    tooltip: {
                        visible: true
                    },
                    title: {
                        text: "Population of Cities"
                    },
                    legend: {
                        visible:false
                    }
                });
               
                var oDataset = new FlattenedDataset({
                    dimensions: [{
                        name: "Year",
                        value: "{Year}"
                    }],

                    measures: [{
                        name: "Amsterdam",
                        value: "{Amsterdam}"
                    }, {
                        name: "Rotterdam",
                        value: "{Rotterdam}"
                    }],

                    data: {
                        path: "/items"
                    }
                });
                this.oVizFrame.setDataset(oDataset);
               
                this.oVizFrame.setModel(this.oDataModel);
               

                this.oFeedValueAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                        "uid": "valueAxis",
                        "type": "Measure",
                        "values": ["Amsterdam"]
                    });
                    this.oFeedValueAxis1 = new sap.viz.ui5.controls.common.feeds.FeedItem({
                        "uid": "valueAxis",
                        "type": "Measure",
                        "values": ["Rotterdam"]
                    });
                
                    var oFeedCategoryAxis = new sap.viz.ui5.controls.common.feeds.FeedItem({
                        "uid": "categoryAxis",
                        "type": "Dimension",
                        "values": ["Year"]
                    });

                this.oVizFrame.addFeed(this.oFeedValueAxis);
                this.oVizFrame.addFeed(this.oFeedValueAxis1);
                this.oVizFrame.addFeed(oFeedCategoryAxis);
                
            },
            onSubmit:function(evt){
                var fromInput = this.getView().byId('from').getProperty('value');
                var toInput = this.getView().byId('to').getProperty('value');

                var itemList = this.jsonData.items;
                
                var filterItems = [];
                if(fromInput == "" && toInput == ""){
                    filterItems = itemList;
                }else if(fromInput != "" && toInput != ""){
                    itemList.forEach(element => {
                       if(element.Year >= fromInput && element.Year <= toInput){
                           filterItems.push(element);
                       }
                    });
                }else if(fromInput != "" && toInput == ""){
                    itemList.forEach(element => {
                        if(element.Year >= fromInput){
                            filterItems.push(element);
                        }
                     });
                }else{
                    itemList.forEach(element => {
                        if(element.Year <= toInput){
                            filterItems.push(element);
                        }
                     });
                }
                
                if(filterItems.length > 10){
                    filterItems = filterItems.slice(filterItems.length -10, filterItems.length);
                }
                
                var filterData = {items:filterItems};
                this.oDataModel.setData(filterData, false);
            },
            onFirstBtn: function (evt) {
                var isExisted = this.oVizFrame.indexOfFeed(this.oFeedValueAxis);
                if (evt.getSource().getPressed() && isExisted == -1) {
                    this.oVizFrame.addFeed(this.oFeedValueAxis);
                } else if(!evt.getSource().getPressed() && isExisted != -1) {
                    this.oVizFrame.removeFeed(this.oFeedValueAxis);    
                }

                var isfirst = this.oVizFrame.indexOfFeed(this.oFeedValueAxis);
                var issecond = this.oVizFrame.indexOfFeed(this.oFeedValueAxis1);
                var scales = [];
                if(isfirst == -1 && issecond != -1){
                    scales = [{
                        'feed': 'color',
                        'palette': ['green']
                    }];
                }else{
                    scales = [{
                        'feed': 'color',
                        'palette': ['#f37221','green']
                    }];
                }
                
                this.oVizFrame.vizUpdate({
                    'scales' : scales,
                });
            },
            onSecondBtn: function (evt) {
                var isExisted = this.oVizFrame.indexOfFeed(this.oFeedValueAxis1);
                if (evt.getSource().getPressed() && isExisted == -1) {
                    this.oVizFrame.addFeed(this.oFeedValueAxis1);
                } else if(!evt.getSource().getPressed() && isExisted != -1) {
                    this.oVizFrame.removeFeed(this.oFeedValueAxis1);    
                }

                var isfirst = this.oVizFrame.indexOfFeed(this.oFeedValueAxis);
                var issecond = this.oVizFrame.indexOfFeed(this.oFeedValueAxis1);
                var scales = [];
                if(isfirst == -1 && issecond != -1){
                    scales = [{
                        'feed': 'color',
                        'palette': ['green']
                    }];
                }else{
                    scales = [{
                        'feed': 'color',
                        'palette': ['#f37221','green']
                    }];
                }
                
                this.oVizFrame.vizUpdate({
                    'scales' : scales,
                });
            }
            // Format.numericFormatter(ChartFormatter.getInstance());
            // var formatPattern = ChartFormatter.DefaultPattern;
            // var oModel = new JSONModel(this.settingsModel);
            // oModel.setDefaultBindingMode(sap.ui.model.BindingMode.OneWay);
            // this.getView().setModel(oModel);
            
            // var oVizFrame = this.oVizFrame = this.getView().byId("idVizFrame");
            // oVizFrame.setVizProperties({
            //     plotArea: {
            //         dataLabel: {
            //             formatString:formatPattern.SHORTFLOAT_MFD2,
            //             visible: true,
            //             showTotal: false
            //         }
            //     },
            //     valueAxis: {
            //         label: {
            //             formatString: formatPattern.SHORTFLOAT
            //         },
            //         title: {
            //             visible: false
            //         }
            //     },
            //     valueAxis2: {
            //         label: {
            //             formatString: formatPattern.SHORTFLOAT
            //         },
            //         title: {
            //             visible: false
            //         }
            //     },
            //     categoryAxis: {
            //         title: {
            //             visible: false
            //         }
            //     },
            //     title: {
            //         visible: false,
            //         text: 'Revenue by City and Store Name'
            //     }
            // });
            // var dataModel = new JSONModel(this.dataPath + "/betterMedium.json");
            // oVizFrame.setModel(dataModel);
            
            // var oPopOver = this.getView().byId("idPopOver");
            // oPopOver.connect(oVizFrame.getVizUid());
            // oPopOver.setFormatString(formatPattern.STANDARDFLOAT);
            
            // InitPageUtil.initPageSettings(this.getView());
        // },
    //     onAfterRendering : function(){
    //         var datasetRadioGroup = this.getView().byId('datasetRadioGroup');
    //         datasetRadioGroup.setSelectedIndex(this.settingsModel.dataset.defaultSelected);

    //         var typeRadioGroup = this.getView().byId('typeRadioGroup');
    //         typeRadioGroup.setSelectedIndex(this.settingsModel.type.defaultSelected);
    //     },
    //     onDatasetSelected : function(oEvent){
    //         if (!oEvent.getParameters().selected) {
    //             return;
    //         }
    //         var datasetRadio = oEvent.getSource();
    //         if(this.oVizFrame && datasetRadio.getSelected()){
    //             var bindValue = datasetRadio.getBindingContext().getObject();
    //             var dataset = {
    //                 data: {
    //                     path: "/milk"
    //                 }
    //             };
    //             var dim = this.settingsModel.dimensions[bindValue.name];
    //             dataset.dimensions = dim;
    //             dataset.measures = this.settingsModel.measures;
    //             var oDataset = new FlattenedDataset(dataset);
    //             this.oVizFrame.setDataset(oDataset);
    //             var dataModel = new JSONModel(this.dataPath + bindValue.value);
    //             this.oVizFrame.setModel(dataModel);

    //             var feed = [];
    //             for (var i = 0; i < dim.length; i++) {
    //                 feed.push(dim[i].name);
    //             }
    //             var feeds = this.oVizFrame.getFeeds();
    //             for (var i = 0; i < feeds.length; i++) {
    //                 if (feeds[i].getUid() === "categoryAxis") {
    //                     var categoryAxisFeed = feeds[i];
    //                     this.oVizFrame.removeFeed(categoryAxisFeed);
    //                     var feed = [];
    //                     for (var i = 0; i < dim.length; i++) {
    //                         feed.push(dim[i].name);
    //                     }
    //                     categoryAxisFeed.setValues(feed);
    //                     this.oVizFrame.addFeed(categoryAxisFeed);
    //                     break;
    //                 }
    //             }
    //         }
    //     },
    //     onDataLabelChanged : function(oEvent){
    //         if(this.oVizFrame){
    //             this.oVizFrame.setVizProperties({
    //                 plotArea: {
    //                     dataLabel: {
    //                         visible: oEvent.getParameter('state')
    //                     }
    //                 }
    //             });
    //         }
    //     },
    //     onAxisTitleChanged : function(oEvent){
    //         if(this.oVizFrame){
    //             var state = oEvent.getParameter('state');
    //             this.oVizFrame.setVizProperties({
    //                 valueAxis: {
    //                     title: {
    //                         visible: state
    //                     }
    //                 },
    //                 categoryAxis: {
    //                     title: {
    //                         visible: state
    //                     }
    //                 }
    //             });
    //         }
    //     },
    //     onTypeSelected : function(oEvent){
    //         if (!oEvent.getParameters().selected) {
    //             return;
    //         }
    //         var sumLabelSwitch = this.getView().byId("sumLabelSwitch");
    //         var typeRadio = oEvent.getSource();
    //         if(this.oVizFrame && typeRadio.getSelected()){
    //             var bindValue = typeRadio.getBindingContext().getObject();
    //             this.oVizFrame.setVizType(bindValue.vizType);
    //             this.oVizFrame.setVizProperties(bindValue.vizProperties);
    //             if (bindValue.vizType === "100_stacked_column") {
    //                 sumLabelSwitch.setState(false);
    //                 sumLabelSwitch.setEnabled(false);
    //             } else {
    //                 sumLabelSwitch.setEnabled(true);
    //                 sumLabelSwitch.setState(this._sumLabelSwitch);
    //             }
    //         }
    //     },
    //     onSumLabelChanged : function(oEvent){
    //         if(this.oVizFrame){
    //             this._sumLabelSwitch = oEvent.getParameter('state');
    //             this.oVizFrame.setVizProperties({
    //                 plotArea: {
    //                     dataLabel: {
    //                         showTotal: this._sumLabelSwitch
    //                     }
    //                 }
    //             });
    //         }
    //     }
    }); 
 
    return Controller;
 
});