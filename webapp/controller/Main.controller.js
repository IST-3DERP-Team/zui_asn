sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageBox",
    "../js/Common",
    "sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
    "sap/ui/core/routing/HashChanger",
    'sap/m/Token',
    'sap/m/ColumnListItem',
    'sap/m/Label',
    "../js/TableValueHelp",
    "../js/TableFilter",
    'jquery.sap.global',
    "../js/SmartFilterCustomControl",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,JSONModel,MessageBox,Common,Filter,FilterOperator,HashChanger,Token,ColumnListItem,Label,TableValueHelp,TableFilter,jQuery,SmartFilterCustomControl) {
        "use strict";

        var me;
        var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "MM/dd/yyyy" });
        var sapDateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYY-MM-dd" });
        var sapDateFormat2 = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "yyyyMMdd" });
        var timeFormat = sap.ui.core.format.DateFormat.getTimeInstance({ pattern: "KK:mm:ss a" });

        return Controller.extend("zuiasn.zuiasn.controller.Main", {
            onInit: function () {            
                me = this;
                this._aColumns = {};
                this._aDataBeforeChange = [];
                this._validationErrors = [];
                this._bHdrChanged = false;
                this._bDtlChanged = false;
                this._dataMode = "READ";
                this._aColFilters = [];
                this._aColSorters = [];
                this._aMultiFiltersBeforeChange = [];
                this._aFilterableColumns = {};
                this._sActiveTable = "headerTab";
                this._oModel = this.getOwnerComponent().getModel();
                this._tableValueHelp = TableValueHelp;
                this._tableFilter = TableFilter;
                this._smartFilterCustomControl = SmartFilterCustomControl;
                this._colFilters = {};

                this._oTables = [
                    { TableId: "headerTab" },
                    { TableId: "detailTab" }
                ];

                this._oTableLayout = {
                    headerTab: {
                        type: "ASNHDR",
                        tabname: "ZDV_3D_ASNHDR"
                    },
                    detailTab: {
                        type: "ASNDET",
                        tabname: "ZERP_SCIASNDET"
                    }
                }

                SmartFilterCustomControl.setSmartFilterModel(this);

                this.getView().setModel(new JSONModel({
                    activeASN: "",
                    activeASNDisplay: "",
                    activeASNDT: "",
                    activeASNDTDisplay: "",
                    fullscreen: {
                        header: false,
                        detail: false
                    },
                    dataWrap: {
                        headerTab: false,
                        detailTab: false
                    },
                    DisplayMode: "change",
                    sbu: ""
                }), "ui");

                this._counts = {
                    header: 0,
                    detail: 0
                }

                this.getView().setModel(new JSONModel(this._counts), "counts");

                this.byId("headerTab")
                    .setModel(new JSONModel({
                        columns: [],
                        rows: []
                }));

                this.byId("detailTab")
                    .setModel(new JSONModel({
                        columns: [],
                        rows: []
                }));

                var oDDTextParam = [], oDDTextResult = {};
                var oModel = this.getOwnerComponent().getModel("ZGW_3DERP_COMMON_SRV");

                //TABLE COLUMNS
                oDDTextParam.push({CODE: "SBU"});
                oDDTextParam.push({CODE: "ASNNO"});
                oDDTextParam.push({CODE: "ASNDT"});
                oDDTextParam.push({CODE: "DLVNO"});
                oDDTextParam.push({CODE: "STATUSCD"});
                oDDTextParam.push({CODE: "EVERS"});
                oDDTextParam.push({CODE: "REFID"});
                oDDTextParam.push({CODE: "LIFNR"});
                oDDTextParam.push({CODE: "VENDREFNO"});
                oDDTextParam.push({CODE: "SHPTOPLNT"});
                oDDTextParam.push({CODE: "CONSIGNEE"});
                oDDTextParam.push({CODE: "ORIGIN"});
                oDDTextParam.push({CODE: "DEST"});
                oDDTextParam.push({CODE: "SHIPDT"});
                oDDTextParam.push({CODE: "ETD"});
                oDDTextParam.push({CODE: "ETA"});
                oDDTextParam.push({CODE: "HBL"});
                oDDTextParam.push({CODE: "MBL"});
                oDDTextParam.push({CODE: "CARRIER"});
                oDDTextParam.push({CODE: "FORWRDR"});
                oDDTextParam.push({CODE: "FORREFNO"});
                oDDTextParam.push({CODE: "VESSEL"});
                oDDTextParam.push({CODE: "VOYAGE"});
                oDDTextParam.push({CODE: "CONTNO"});
                oDDTextParam.push({CODE: "SEALNO"});
                oDDTextParam.push({CODE: "GRSWT"});
                oDDTextParam.push({CODE: "TOTALPKG"});
                oDDTextParam.push({CODE: "INVNO"});
                oDDTextParam.push({CODE: "INVDT"});
                oDDTextParam.push({CODE: "LCNO"});
                oDDTextParam.push({CODE: "COO"});
                oDDTextParam.push({CODE: "REMARKS"});
                oDDTextParam.push({CODE: "DELETED"});
                oDDTextParam.push({CODE: "CREATEDBY"});
                oDDTextParam.push({CODE: "CREATEDDT"});
                oDDTextParam.push({CODE: "UPDATEDBY"});
                oDDTextParam.push({CODE: "UPDATEDDT"});
                oDDTextParam.push({CODE: "SEQNO"});
                oDDTextParam.push({CODE: "PLANTCD"});
                oDDTextParam.push({CODE: "MATNO"});
                oDDTextParam.push({CODE: "BATCH"});
                oDDTextParam.push({CODE: "ITEMDESC"});
                oDDTextParam.push({CODE: "VENDBATCH"});
                oDDTextParam.push({CODE: "EBELN"});
                oDDTextParam.push({CODE: "POVERNO"});
                oDDTextParam.push({CODE: "EBELP"});
                oDDTextParam.push({CODE: "HUID"});
                oDDTextParam.push({CODE: "PKGNO"});
                oDDTextParam.push({CODE: "SHIPQTY"});
                oDDTextParam.push({CODE: "FOCQTY"});
                oDDTextParam.push({CODE: "ORDUOM"});
                oDDTextParam.push({CODE: "SHIPBSEQTY"});
                oDDTextParam.push({CODE: "FOCBSEQTY"});
                oDDTextParam.push({CODE: "BASEUOM"});
                oDDTextParam.push({CODE: "NETWT"});
                oDDTextParam.push({CODE: "WTUOM"});
                oDDTextParam.push({CODE: "PKGDIM"});
                oDDTextParam.push({CODE: "LNDIM"});
                oDDTextParam.push({CODE: "WDDIM"});
                oDDTextParam.push({CODE: "HTDIM"});
                oDDTextParam.push({CODE: "DIMUOM"});
                oDDTextParam.push({CODE: "COLOR"});
                oDDTextParam.push({CODE: "PATTERN"});
                oDDTextParam.push({CODE: "QRCODE"});

                //LABELS
                oDDTextParam.push({CODE: "REFRESH"});
                oDDTextParam.push({CODE: "CREATEID"});
                oDDTextParam.push({CODE: "FULLSCREEN"});
                oDDTextParam.push({CODE: "EXITFULLSCREEN"});
                oDDTextParam.push({CODE: "SAVELAYOUT"});
                oDDTextParam.push({CODE: "DELETE"});
                oDDTextParam.push({CODE: "WRAP"});
                oDDTextParam.push({CODE: "UNWRAP"});
                
                //INFO
                oDDTextParam.push({CODE: "INFO_NO_RECORD_TO_PROC"});
                oDDTextParam.push({CODE: "INFO_NO_SEL_RECORD_TO_PROC"});
                oDDTextParam.push({CODE: "INFO_NO_LAYOUT"});
                oDDTextParam.push({CODE: "INFO_LAYOUT_SAVE"});
                oDDTextParam.push({CODE: "INFO_SEL_RECORD_TO_DELETE"});  
                oDDTextParam.push({CODE: "INFO_NO_RECORD_TO_DELETE"});  
                oDDTextParam.push({CODE: "INFO_ASN_DELETE_NOT_ALLOW"});
                oDDTextParam.push({CODE: "INFO_DATA_DELETED"});  
                oDDTextParam.push({CODE: "CONF_DELETE_RECORDS"});
                oDDTextParam.push({CODE: "INFO_ERROR"});
                oDDTextParam.push({CODE: "CANCEL"});
                oDDTextParam.push({CODE: "CLOSE"});
                oDDTextParam.push({CODE: "DELETE"});
                oDDTextParam.push({CODE: "REFRESH"});
                oDDTextParam.push({CODE: "FULLSCREEN"});
                oDDTextParam.push({CODE: "EXITFULLSCREEN"});

                oModel.create("/CaptionMsgSet", { CaptionMsgItems: oDDTextParam  }, {
                    method: "POST",
                    success: function(oData, oResponse) {        
                        oData.CaptionMsgItems.results.forEach(item => {
                            oDDTextResult[item.CODE] = item.TEXT;
                        })

                        me.getView().setModel(new JSONModel(oDDTextResult), "ddtext");
                    },
                    error: function(err) { }
                });

                var oTableEventDelegate = {
                    onkeyup: function (oEvent) {
                        me.onKeyUp(oEvent);
                    },

                    onAfterRendering: function (oEvent) {
                        var oControl = oEvent.srcControl;
                        var sTabId = oControl.sId.split("--")[oControl.sId.split("--").length - 1];

                        if (sTabId.substr(sTabId.length - 3) === "Tab") me._tableRendered = sTabId;
                        else me._tableRendered = "";

                        me.onAfterTableRendering();
                    },

                    onclick: function(oEvent) {
                        me.onTableClick(oEvent);
                    }
                };

                this.byId("headerTab").addEventDelegate(oTableEventDelegate);
                this.byId("detailTab").addEventDelegate(oTableEventDelegate);
                this.getColumnProp();

                // this.getHeaderData();

                this.getAppAction();
            }, 

            getAppAction: async function() {
                var csAction = "change";
                if (sap.ushell.Container !== undefined) {
                    const fullHash = new HashChanger().getHash(); 
                    const urlParsing = await sap.ushell.Container.getServiceAsync("URLParsing");
                    const shellHash = urlParsing.parseShellHash(fullHash); 
                    const sAction = shellHash.action;
                    csAction = shellHash.action;
                }

                var DisplayStateModel = new JSONModel();
                var DisplayData = {
                    sAction: csAction,
                    visible: csAction === "display" ? false : true
                }

                this.getView().getModel("ui").setProperty("/DisplayMode", csAction);

                DisplayStateModel.setData(DisplayData);
                this.getView().setModel(DisplayStateModel, "DisplayActionModel");

                // this.byId("btnAddHdr").setVisible(csAction === "display" ? false : true);
                // this.byId("btnEditHdr").setVisible(csAction === "display" ? false : true);
                // this.byId("btnDeleteHdr").setVisible(csAction === "display" ? false : true);
            },

            addDateFilters: function (aSmartFilter) {
                //get the date filter of effect date
                var vEffectDate = this.getView().byId("EFFECTDTDatePicker").getValue();
                var aFilter = [];
                
                if (vEffectDate !== undefined && vEffectDate !== '') {
                    vEffectDate = vEffectDate.replace(/\s/g, '').toString(); //properly format the date for ABAP
                    var vEffectDateStr = vEffectDate.split('-');
                    var vEffectDate1 = vEffectDateStr[0];
                    var vEffectDate2 = vEffectDateStr[1];

                    if (vEffectDate2 === undefined) {
                        vEffectDate2 = vEffectDate1;
                    }

                    var lv_effectDateFilter = new sap.ui.model.Filter({
                        path: "EFFECTDT",
                        operator: sap.ui.model.FilterOperator.BT,
                        value1: vEffectDate1,
                        value2: vEffectDate2
                    });

                    aFilter.push(lv_effectDateFilter);
                    aSmartFilter[0].aFilters.push(new Filter(aFilter, false));
                }
            },

            onSBUChange: async function (oEvent) {
                // alert("onSBUChange");
                this._sbuChange = true;
                
                var me = this;                
                var vSBU = this.getView().byId("cboxSBU").getSelectedKey();
                
                // _promiseResult = new Promise((resolve, reject) => {
                //     oModel.read("/ZVB_3DERP_SHIPMODE_SH", {
                //         success: function (oData, oResponse) {
                //             console.log("SHIPMODE_MODEL", oData.results);
                //             me.getView().setModel(new JSONModel(oData.results), "SHIPMODE_MODEL");
                //         },
                //         error: function (err) { }
                //     });
                //     resolve();
                // });
                // await _promiseResult;
            },

            onSearch: function () {
                // var vSBU = this.getView().byId("cboxSBU").getSelectedKey();
                // this.getView().getModel("ui").setProperty("/currsbu", vSBU);

                this.getView().getModel("ui").setProperty("/activeASN", "");
                this.getView().getModel("ui").setProperty("/activeASNDisplay", "");

                this.getView().getModel("ui").setProperty("/activeASNDT", "");
                this.getView().getModel("ui").setProperty("/activeASNDTDisplay", "");

                if (this.getView().byId("cboxSBU") !== undefined) {
                    this._sbu = this.getView().byId("cboxSBU").getSelectedKey();
                    // console.log(this._sbu);
                } else {
                    //SBU as DropdownList
                    this._sbu = this.getView().byId("smartFilterBar").getFilterData().SBU;  //get selected SBU
                    // console.log(this._sbu);
                }

                this.getView().getModel("ui").setProperty("/sbu", this._sbu);

                this.getColumnProp();

                this.getHeaderData();

                // this.getDetailData(true);
            },

            getHeaderData() {
                Common.openProcessingDialog(me, "Processing...");

                var oSmartFilter = this.getView().byId("smartFilterBar").getFilters();
                var aFilters = [], aFilter = [], aSmartFilter = [];

                // var vSBU = this.getView().getModel("ui").getProperty("/sbu");
                
                if (oSmartFilter.length > 0)  {
                    oSmartFilter[0].aFilters.forEach(item => {
                        if (item.aFilters === undefined) {
                            console.log("aFilter", item);
                            if(item.sPath === "LIFNR" && item.oValue1.length === 7) {
                                aFilter.push(new Filter(item.sPath, item.sOperator, "000" + item.oValue1));
                            } else {
                            aFilter.push(new Filter(item.sPath, item.sOperator, item.oValue1));
                            }
                        }
                        else {
                            aFilters.push(item);
                        }
                    })

                    if (aFilter.length > 0) { aFilters.push(new Filter(aFilter, false)); }
                }

                if (Object.keys(this._oSmartFilterCustomControlProp).length > 0) {
                    Object.keys(this._oSmartFilterCustomControlProp).forEach(item => {
                        var oCtrl = this.getView().byId("smartFilterBar").determineControlByName(item);

                        if (oCtrl) {
                            var aCustomFilter = [];
    
                            if (oCtrl.getTokens().length === 1) {
                                oCtrl.getTokens().map(function(oToken) {
                                    console.log("aFilters", item);
                                    if(item === "LIFNR" && oToken.getKey().length === 7) {
                                        aFilters.push(new Filter(item, FilterOperator.EQ, "000" + oToken.getKey()))
                                    } else {
                                        aFilters.push(new Filter(item, FilterOperator.EQ, oToken.getKey()))
                                    }
                                })
                            }
                            else if (oCtrl.getTokens().length > 1) {
                                oCtrl.getTokens().map(function(oToken) {
                                    console.log("aCustomFilter", item);
                                    if(item === "LIFNR" && oToken.getKey().length === 7) {
                                        aCustomFilter.push(new Filter(item, FilterOperator.EQ, "000" + oToken.getKey()))
                                    } else {
                                        aCustomFilter.push(new Filter(item, FilterOperator.EQ, oToken.getKey()))
                                    }
                                })
    
                                aFilters.push(new Filter(aCustomFilter));
                            }
                        }
                    })
                }

                aFilters.push(new Filter("SBU", FilterOperator.EQ, this._sbu));
                aSmartFilter.push(new Filter(aFilters, true));

                // this.addDateFilters(aSmartFilter);
                console.log(aSmartFilter);

                // return;

                this._oModel.read('/ASNHDRSet', {
                    filters: aSmartFilter,
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            console.log("ASNHDRSet", oData);
                            // oData.results.sort((a,b) => (a.SEQ > b.SEQ ? 1 : -1));

                            oData.results.sort(function(a,b) {
                                return new Date(b.CREATEDDT) - new Date(a.CREATEDDT);
                            });

                            oData.results.forEach((item, index) => {  
                                if (item.ASNDT !== null && item.ASNDT !== "  /  /" && item.ASNDT !== "") {
                                    item.ASNDT = dateFormat.format(new Date(item.ASNDT));
                                }
                                if (item.SHIPDT !== null && item.SHIPDT !== "  /  /" && item.SHIPDT !== "") {
                                    item.SHIPDT = dateFormat.format(new Date(item.SHIPDT));
                                }
                                if (item.ETD !== null && item.ETD !== "  /  /" && item.ETD !== "") {
                                    item.ETD = dateFormat.format(new Date(item.ETD));
                                }
                                if (item.ETA !== null && item.ETA !== "  /  /" && item.ETA !== "") {
                                    item.ETA = dateFormat.format(new Date(item.ETA));
                                }
                                if (item.INVDT !== null && item.INVDT !== "  /  /" && item.INVDT !== "") {
                                    item.INVDT = dateFormat.format(new Date(item.INVDT));
                                }
                                if (item.CREATEDDT !== null && item.CREATEDDT !== "  /  /" && item.CREATEDDT !== "") {
                                    item.CREATEDDT = dateFormat.format(new Date(item.CREATEDDT)) + " " + me.formatTimeOffSet(item.CREATEDTM.ms);// + " " + timeFormat.format(new Date(item.CREATEDTM));
                                }
                                if (item.UPDATEDDT !== null && item.UPDATEDDT !== "  /  /" && item.UPDATEDDT !== "" && item.UPDATEDDT !== " //  /  /" && item.UPDATEDDT != "  /  /") {
                                    item.UPDATEDDT = dateFormat.format(new Date(item.UPDATEDDT)) + " " + me.formatTimeOffSet(item.UPDATEDTM.ms);// + " " + timeFormat.format(new Date(item.UPDATEDTM));
                                }
    
                                if (index === 0) {
                                    item.ACTIVE = "X";
                                    me.getView().getModel("ui").setProperty("/activeASN", item.ASNNO);
                                    me.getView().getModel("ui").setProperty("/activeASNDisplay", item.ASNNO);

                                    me.getView().getModel("ui").setProperty("/activeASNDT", item.ASNDT);
                                    me.getView().getModel("ui").setProperty("/activeASNDTDisplay", item.ASNDT);

                                    console.log(me.getView().getModel("ui").getProperty("/activeASNDT"));
                                }
                                else item.ACTIVE = "";
                            });

                            me.getView().setModel(new JSONModel(oData.results), "HEADER_MODEL");
                            
                            me.getDetailData(true);
                        }
                        else {
                            me.byId("detailTab").getModel().setProperty("/rows", []);
                            me.byId("detailTab").bindRows("/rows");
                            me.getView().getModel("counts").setProperty("/detail", 0);
                            Common.closeProcessingDialog(me);
                        }

                        me.byId("headerTab").getModel().setProperty("/rows", oData.results);
                        me.byId("headerTab").bindRows("/rows");
                        me.getView().getModel("counts").setProperty("/header", oData.results.length);
                        me.setActiveRowHighlight("headerTab");

                        // if (me._aColFilters.length > 0) { me.setColumnFilters("headerTab"); }
                        if (me._aColSorters.length > 0) { me.setColumnSorters("headerTab"); }
                        TableFilter.applyColFilters("headerTab", me);

                        Common.closeProcessingDialog(me);
                    },
                    error: function (err) { 
                        Common.closeProcessingDialog(me);
                    }
                })
            },

            getDetailData(arg) {
                if (arg) Common.openProcessingDialog(me, "Processing...");

                var vASN = this.getView().getModel("ui").getData().activeASN;
                var vASNDT = sapDateFormat.format(new Date(this.getView().getModel("ui").getData().activeASNDT)) + "T00:00:00";

                // var vASNDT = this.getView().getModel("ui").getData().activeASNDT + "T00:00:00";
                // var pASNDT = sapDateFormat.format(vASNDT) + "T00:00:00";

                console.log(vASNDT);
                // console.log(pASNDT);

                var filter = "ASNNO eq '" + vASN + "' and ASNDT eq datetime'" + vASNDT + "'";
                console.log(filter);

                // Common.closeProcessingDialog(me);
                // return;

                this._oModel.read('/ASNDETSet', {
                    urlParameters: {
                        "$filter": "ASNNO eq '" + vASN + "' and ASNDT eq datetime'" + vASNDT + "'"
                    },
                    success: function (oData) {
                        if (oData.results.length > 0) {
                            oData.results.forEach((item, index) => {  
                                if (item.CREATEDDT !== null)
                                    item.CREATEDDT = dateFormat.format(new Date(item.CREATEDDT));
    
                                if (item.UPDATEDDT !== null)
                                    item.UPDATEDDT = dateFormat.format(new Date(item.UPDATEDDT));
    
                                if (index === 0) item.ACTIVE = "X";
                                else item.ACTIVE = "";
                            });
                        }

                        me.byId("detailTab").getModel().setProperty("/rows", oData.results);
                        me.byId("detailTab").bindRows("/rows");
                        me.getView().getModel("counts").setProperty("/detail", oData.results.length);
                        me.setActiveRowHighlight("detailTab");

                        // if (me._aColFilters.length > 0) { me.setColumnFilters("detailTab"); }
                        if (me._aColSorters.length > 0) { me.setColumnSorters("detailTab"); }
                        TableFilter.applyColFilters("detailTab", me);

                        Common.closeProcessingDialog(me);
                    },
                    error: function (err) {
                        Common.closeProcessingDialog(me);
                    }
                })
            },

            getColumnProp: async function () {
                var sPath = jQuery.sap.getModulePath("zuiasn.zuiasn", "/model/columns.json");

                var oModelColumns = new JSONModel();
                await oModelColumns.loadData(sPath);

                var oColumns = oModelColumns.getData();
                this._oModelColumns = oModelColumns.getData();
                // var oColumns = [];

                //get dynamic columns based on saved layout or ZERP_CHECK
                setTimeout(() => {
                    this.getDynamicColumns("ASNHDR", "ZDV_3D_ASNHDR", "headerTab", oColumns);
                }, 100);

                setTimeout(() => {
                    this.getDynamicColumns("ASNDET", "ZERP_SCIASNDET", "detailTab", oColumns);
                }, 100);
            },
            
            getDynamicColumns(arg1, arg2, arg3, arg4) {
                var me = this;
                var sType = arg1;
                var sTabName = arg2;
                var sTabId = arg3;
                var oLocColProp = arg4;
                var oModel = this.getOwnerComponent().getModel("ZGW_3DERP_COMMON_SRV");
                // var oModel = new sap.ui.model.odata.ODataModel("/sap/opu/odata/sap/ZGW_3DERP_COMMON_SRV/");
                var vSBU = "VER"; 

                // console.log("getDynamicColumns", oModel);

                oModel.setHeaders({
                    sbu: vSBU,
                    type: sType,
                    tabname: sTabName
                });

                // console.log("1", oModel.getHeaders());
                oModel.read("/ColumnsSet", {
                    
                    success: function (oData, oResponse) {
                        // console.log("2");
                        console.log(arg1, oData);  
                        if (oData.results.length > 0) {
                            if (oLocColProp[sTabId.replace("Tab", "")] !== undefined) {
                                oData.results.forEach(item => {
                                    oLocColProp[sTabId.replace("Tab", "")].filter(loc => loc.ColumnName === item.ColumnName)
                                        .forEach(col => {
                                            item.ValueHelp = col.ValueHelp;
                                            item.TextFormatMode = col.TextFormatMode;
                                        })
                                })
                            }
                            
                            me._aColumns[sTabId.replace("Tab", "")] = oData.results;
                            me.setTableColumns(sTabId, oData.results);

                            // var oDDTextResult = me.getView().getModel("ddtext").getData();
                            // oData.results.forEach(item => {
                            //     oDDTextResult[item.ColumnName] = item.ColumnLabel;
                            // })

                            // me.getView().setModel(new JSONModel(oDDTextResult), "ddtext");                                                      
                        }
                    },
                    error: function (err) {
                        // console.log("3");
                        // console.log("err", err);
                    }
                });
            },

            setTableColumns(arg1, arg2) {
                var sTabId = arg1;
                var oColumns = arg2;
                var oTable = this.getView().byId(sTabId);
                // console.log(oTable)
                oTable.getModel().setProperty("/columns", oColumns);

                // sap.ui.table.Table.prototype._scrollNext = function() {
                //     // we are at the end => scroll one down if possible
                //     if (this.getFirstVisibleRow() < this._getRowCount() - this.getVisibleRowCount()) {
                //         this.setFirstVisibleRow(Math.min(this.getFirstVisibleRow() + 1, this._getRowCount() - this.getVisibleRowCount()));
                //     }
                // };

                //bind the dynamic column to the table
                oTable.bindColumns("/columns", function (index, context) {
                    var sColumnId = context.getObject().ColumnName;
                    var sColumnLabel =  context.getObject().ColumnLabel;
                    var sColumnWidth = context.getObject().ColumnWidth;
                    var sColumnVisible = context.getObject().Visible;
                    var sColumnSorted = context.getObject().Sorted;
                    var sColumnSortOrder = context.getObject().SortOrder;
                    var sColumnDataType = context.getObject().DataType;
                    var sTextWrapping = context.getObject().WrapText;

                    if (sColumnWidth === 0) sColumnWidth = 100; 

                    var oText = new sap.m.Text({
                        wrapping: sTextWrapping === "X" ? true : false
                        // , tooltip: sColumnDataType === "BOOLEAN" || sColumnDataType === "NUMBER" ? "" : "{" + sColumnId + "}",
                        // width: (+sColumnWidth-15) + "px"
                    })

                    var oColProp = me._aColumns[sTabId.replace("Tab", "")].filter(fItem => fItem.ColumnName === sColumnId);
                    
                    if (oColProp && oColProp.length > 0 && oColProp[0].ValueHelp && oColProp[0].ValueHelp["items"].text && oColProp[0].ValueHelp["items"].value !== oColProp[0].ValueHelp["items"].text &&
                        oColProp[0].TextFormatMode && oColProp[0].TextFormatMode !== "Key") {
                        oText.bindText({  
                            parts: [  
                                { path: sColumnId }
                            ],  
                            formatter: function(sKey) {
                                // console.log(oColProp[0].ValueHelp["items"].path, me.getView().getModel(oColProp[0].ValueHelp["items"].path).getData());
                                var oValue = me.getView().getModel(oColProp[0].ValueHelp["items"].path).getData().filter(v => v[oColProp[0].ValueHelp["items"].value] === sKey);
                                                      
                                // this.removeStyleClass("green");

                                // if (sKey === "COMM") {
                                //     this.addStyleClass("green");
                                // }
                                
                                if (oValue && oValue.length > 0) {
                                    if (oColProp[0].TextFormatMode === "Value") {
                                        return oValue[0][oColProp[0].ValueHelp["items"].text];
                                    }
                                    else if (oColProp[0].TextFormatMode === "ValueKey") {
                                        return oValue[0][oColProp[0].ValueHelp["items"].text] + " (" + sKey + ")";
                                    }
                                    else if (oColProp[0].TextFormatMode === "KeyValue") {
                                        return sKey + " (" + oValue[0][oColProp[0].ValueHelp["items"].text] + ")";
                                    }
                                }
                                else return sKey;
                            }
                        });                        
                    }
                    else {
                        oText.bindText({  
                            parts: [  
                                { path: sColumnId }
                            ]
                        }); 
                    } 

                    if (sColumnDataType === "STRING") {
                        return new sap.ui.table.Column({
                            id: sTabId.replace("Tab", "") + "Col" + sColumnId,
                            label: new sap.m.Text({ text: sColumnLabel, wrapping: true }),  //sColumnLabel,
                            template: oText,
                            // template: new sap.m.Text({
                            //     text: "{" + sColumnId + "}",
                            //     wrapping: false
                            //     // , 
                            //     // tooltip: "{" + sColumnId + "}"
                            // }),
                            width: sColumnWidth + "px",
                            sortProperty: sColumnId,
                            filterProperty: sColumnId,
                            autoResizable: true,
                            visible: sColumnVisible,
                            sorted: sColumnSorted,
                            hAlign: sColumnDataType === "NUMBER" ? "End" : sColumnDataType === "BOOLEAN" ? "Center" : "Begin",
                            sortOrder: ((sColumnSorted === true) ? sColumnSortOrder : "Ascending")
                        });
                    } else if (sColumnDataType === "BOOLEAN") {
                        return new sap.ui.table.Column({
                            id: sTabId.replace("Tab", "") + "Col" + sColumnId,
                            label: new sap.m.Text({ text: sColumnLabel, wrapping: true }),  //sColumnLabel
                            template: new sap.m.CheckBox({
                                selected: "{" + sColumnId + "}",
                                editable: false
                            }),
                            width: sColumnWidth + "px",
                            sortProperty: sColumnId,
                            filterProperty: sColumnId,
                            autoResizable: true,
                            visible: sColumnVisible,
                            sorted: sColumnSorted,
                            hAlign: "Center",
                            sortOrder: ((sColumnSorted === true) ? sColumnSortOrder : "Ascending")
                        });
                    } else {
                        return new sap.ui.table.Column({
                            id: sTabId.replace("Tab", "") + "Col" + sColumnId,
                            label: new sap.m.Text({ text: sColumnLabel, wrapping: true }),  //sColumnLabel
                            template: oText,
                            width: sColumnWidth + "px",
                            sortProperty: sColumnId,
                            filterProperty: sColumnId,
                            autoResizable: true,
                            visible: sColumnVisible,
                            sorted: sColumnSorted,
                            hAlign: sColumnDataType === "NUMBER" ? "End" : sColumnDataType === "BOOLEAN" ? "Center" : "Begin",
                            sortOrder: ((sColumnSorted === true) ? sColumnSortOrder : "Ascending")
                        });
                    }

                    // return new sap.ui.table.Column({
                    //     id: sTabId.replace("Tab", "") + "Col" + sColumnId,
                    //     name: sColumnId,
                    //     label: new sap.m.Text({ text: sColumnLabel }),
                    //     template: oText,
                    //     width: sColumnWidth + "px",
                    //     sortProperty: sColumnId,
                    //     // filterProperty: sColumnId,
                    //     autoResizable: true,
                    //     visible: sColumnVisible,
                    //     sorted: sColumnSorted,
                    //     hAlign: sColumnDataType === "NUMBER" ? "End" : sColumnDataType === "BOOLEAN" ? "Center" : "Begin",
                    //     sortOrder: ((sColumnSorted === true) ? sColumnSortOrder : "Ascending")
                    // });
                });

                //date/number sorting
                oTable.attachSort(function(oEvent) {
                    var sPath = oEvent.getParameter("column").getSortProperty();
                    var bMultiSort = oEvent.getParameter("columnAdded");
                    var bDescending, sSortOrder, oSorter, oColumn, columnType;
                    var aSorts = [];

                    if (!bMultiSort) {
                        oTable.getColumns().forEach(col => {
                            if (col.getSorted()) {
                                col.setSorted(false);
                            }
                        })
                    }

                    oTable.getSortedColumns().forEach(col => {
                        if (col.getProperty("name") === sPath) {
                            sSortOrder = oEvent.getParameter("sortOrder");
                            oEvent.getParameter("column").setSorted(true); //sort icon indicator
                            oEvent.getParameter("column").setSortOrder(sSortOrder); //set sort order                          
                        }
                        else {
                            sSortOrder = col.getProperty("sortOrder");
                        }

                        bDescending = (sSortOrder === "Descending" ? true : false);
                        oSorter = new sap.ui.model.Sorter(col.getProperty("name"), bDescending); //sorter(columnData, If Ascending(false) or Descending(True))
                        oColumn = oColumns.filter(fItem => fItem.ColumnName === col.getProperty("name"));
                        columnType = oColumn[0].DataType;

                        if (columnType === "DATETIME") {
                            oSorter.fnCompare = function(a, b) {
                                // parse to Date object
                                var aDate = new Date(a);
                                var bDate = new Date(b);
    
                                if (bDate === null) { return -1; }
                                if (aDate === null) { return 1; }
                                if (aDate < bDate) { return -1; }
                                if (aDate > bDate) { return 1; }
    
                                return 0;
                            };
                        }
                        else if (columnType === "NUMBER") {
                            oSorter.fnCompare = function(a, b) {
                                // parse to Date object
                                var aNumber = +a;
                                var bNumber = +b;
    
                                if (bNumber === null) { return -1; }
                                if (aNumber === null) { return 1; }
                                if (aNumber < bNumber) { return -1; }
                                if (aNumber > bNumber) { return 1; }
    
                                return 0;
                            };
                        }

                        aSorts.push(oSorter);
                    })

                    oTable.getBinding('rows').sort(aSorts);

                    // prevent internal sorting by table
                    oEvent.preventDefault();
                });

                // oTable.attachSort(function(oEvent) {
                //     var sPath = oEvent.getParameter("column").getSortProperty();
                //     var bDescending = false;
                    
                //     oTable.getColumns().forEach(col => {
                //         if (col.getSorted()) {
                //             col.setSorted(false);
                //         }
                //     })

                //     oEvent.getParameter("column").setSorted(true); //sort icon initiator

                //     if (oEvent.getParameter("sortOrder") === "Descending") {
                //         bDescending = true;
                //         oEvent.getParameter("column").setSortOrder("Descending") //sort icon Descending
                //     }
                //     else {
                //         oEvent.getParameter("column").setSortOrder("Ascending") //sort icon Ascending
                //     }

                //     var oSorter = new sap.ui.model.Sorter(sPath, bDescending ); //sorter(columnData, If Ascending(false) or Descending(True))
                //     var oColumn = oColumns.filter(fItem => fItem.ColumnName === oEvent.getParameter("column").getProperty("sortProperty"));
                //     var columnType = oColumn[0].DataType;

                //     if (columnType === "DATETIME") {
                //         oSorter.fnCompare = function(a, b) {
                //             // parse to Date object
                //             var aDate = new Date(a);
                //             var bDate = new Date(b);

                //             if (bDate === null) { return -1; }
                //             if (aDate === null) { return 1; }
                //             if (aDate < bDate) { return -1; }
                //             if (aDate > bDate) { return 1; }

                //             return 0;
                //         };
                //     }
                //     else if (columnType === "NUMBER") {
                //         oSorter.fnCompare = function(a, b) {
                //             // parse to Date object
                //             var aNumber = +a;
                //             var bNumber = +b;

                //             if (bNumber === null) { return -1; }
                //             if (aNumber === null) { return 1; }
                //             if (aNumber < bNumber) { return -1; }
                //             if (aNumber > bNumber) { return 1; }

                //             return 0;
                //         };
                //     }
                    
                //     oTable.getBinding('rows').sort(oSorter);
                //     // prevent internal sorting by table
                //     oEvent.preventDefault();
                // });
                
                TableFilter.updateColumnMenu(sTabId, this);

                var vWrap = oColumns[0].WrapText === "X" ? true : false;
                this.getView().getModel("ui").setProperty("/dataWrap/" + sTabId, vWrap);
                
                // oColumns.forEach(item => {
                //     var aFilterableColumns = [];
                //     aFilterableColumns.push({
                //         name: item.ColumnName
                //     });
                // })

                // var oSubMenu = new sap.ui.unified.Menu();
                // var oSubMenuItem = new sap.ui.unified.MenuItem({
                //     text: "test",
                //     select: function(oEvent) {
                //         alert(oEvent.getParameter("item").getText() + " Selected!");
                //     },
                //     icon: "sap-icon://filter"
                // });
                // oSubMenu.addItem(oSubMenuItem)
                
                // var oMenuItem = new sap.ui.unified.MenuItem({
                //     icon: "sap-icon://filter",
                //     text: "Filter",
                //     // select: "onQuantityCustomItemSelect"
                //     submenu: oSubMenu
                // })

                // oTable.getColumns().forEach(col => {
                //     console.log(col.getMenu())
                //     // Loop onto each column and attach Column Menu Open event
                //     col.attachColumnMenuOpen(function(oEvent) {
                //         //Get Menu associated with column
                //         var oMenu = col.getMenu();                        

                //         //Create the Menu Item that need to be added
                //         setTimeout(() => {
                //             console.log(oMenu)
                //             var wCustomFilter = false;
                //             oMenu.getItems().forEach(item => {
                //                 if (item.sId.indexOf("filter") >= 0) {
                //                     oMenu.removeItem(item);
                //                 }

                //                 if (item.mProperties.text !== undefined && item.mProperties.text === "Filter") {
                //                     wCustomFilter = true;
                //                 }
                //             })
                            
                //             if (!wCustomFilter) {
                //                 oMenu.insertItem(oMenuItem, 2);                               
                //             }
                            
                //             oMenu.setPageSize(oMenu.getItems().length); 
                //         }, 10);
                //     });
                // });
            },

            onRefresh: function (oEvent) {
                var oTable = oEvent.getSource().oParent.oParent;
                var sTabId = oTable.sId.split("--")[oTable.sId.split("--").length - 1];
                this._sActiveTable = sTabId;
                this.refreshData();
            },

            refreshData() {
                if (this._dataMode === "READ") {
                    this._aColFilters = this.byId(this._sActiveTable).getBinding("rows").aFilters;
                    this._aColSorters = this.byId(this._sActiveTable).getBinding("rows").aSorters;

                    if (this._sActiveTable === "headerTab") {
                        this.getHeaderData();
                    }
                    else if (this._sActiveTable === "detailTab") {
                        this.getDetailData(true);
                    }
                }
            },

            onKeyUp(oEvent) {
                if ((oEvent.key === "ArrowUp" || oEvent.key === "ArrowDown") && oEvent.srcControl.sParentAggregationName === "rows") {
                    var oTable = this.byId(oEvent.srcControl.sId).oParent;

                    if (this.byId(oEvent.srcControl.sId).getBindingContext()) {
                        var sRowPath = this.byId(oEvent.srcControl.sId).getBindingContext().sPath;

                        oTable.getModel().getData().rows.forEach(row => row.ACTIVE = "");
                        oTable.getModel().setProperty(sRowPath + "/ACTIVE", "X");

                        oTable.getRows().forEach(row => {
                            if (row.getBindingContext() && row.getBindingContext().sPath.replace("/rows/", "") === sRowPath.replace("/rows/", "")) {
                                row.addStyleClass("activeRow");
                            }
                            else row.removeStyleClass("activeRow")
                        })
                    }

                    if (oTable.getId().indexOf("headerTab") >= 0) {
                        var oTableDetail = this.byId("detailTab");
                        var oColumns = oTableDetail.getColumns();

                        for (var i = 0, l = oColumns.length; i < l; i++) {
                            if (oColumns[i].getSorted()) {
                                oColumns[i].setSorted(false);
                            }
                        }
                    }
                }
                // else if (oEvent.key === "Enter" && oEvent.srcControl.sParentAggregationName === "cells") {
                //     if (this._dataMode === "NEW") this.onAddNewRow();
                // }               
            },

            onAfterTableRendering: function (oEvent) {
                if (this._tableRendered !== "") {
                    this.setActiveRowHighlightByTableId(this._tableRendered);
                    this._tableRendered = "";
                }
            },

            setActiveRowHighlightByTable(arg) {
                var oTable = arg;

                setTimeout(() => {
                    oTable.getRows().forEach(row => {
                        if (row.getBindingContext() && +row.getBindingContext().sPath.replace("/rows/", "") === iActiveRowIndex) {
                            row.addStyleClass("activeRow");
                        }
                        else row.removeStyleClass("activeRow");
                    })
                }, 1);
            },

            setActiveRowHighlightByTableId(arg) {
                var oTable = this.byId(arg);

                setTimeout(() => {
                    var iActiveRowIndex = oTable.getModel().getData().rows.findIndex(item => item.ACTIVE === "X");

                    oTable.getRows().forEach(row => {
                        if (row.getBindingContext() && +row.getBindingContext().sPath.replace("/rows/", "") === iActiveRowIndex) {
                            row.addStyleClass("activeRow");
                        }
                        else row.removeStyleClass("activeRow");
                    })
                }, 10);
            },

            onCellClick: function (oEvent) {
                if (oEvent.getParameters().rowBindingContext) {
                    var oTable = oEvent.getSource(); //this.byId("ioMatListTab");
                    var sRowPath = oEvent.getParameters().rowBindingContext.sPath;

                    if (oTable.getId().indexOf("headerTab") >= 0) {
                        var vCurrASN = oTable.getModel().getProperty(sRowPath + "/ASNNO");
                        var vPrevASN = this.getView().getModel("ui").getData().activeASN;

                        var vCurrASNDT = oTable.getModel().getProperty(sRowPath + "/ASNDT");
                        var vPrevASNDT = this.getView().getModel("ui").getData().activeASNDT;

                        console.log(vCurrASN);
                        console.log(vPrevASN);

                        console.log(vCurrASNDT);
                        console.log(vPrevASNDT);

                        if (vCurrASN !== vPrevASN && vCurrASNDT !== vPrevASNDT) {
                            this.getView().getModel("ui").setProperty("/activeASN", vCurrASN);
                            this.getView().getModel("ui").setProperty("/activeASNDT", vCurrASNDT);

                            if (this._dataMode === "READ") {
                                this.getView().getModel("ui").setProperty("/activeASNDisplay", vCurrASN);
                                this.getView().getModel("ui").setProperty("/activeASNDTDisplay", vCurrASNDT);
                                this.getDetailData(true);
                            }

                            var oTableDetail = this.byId("detailTab");
                            var oColumns = oTableDetail.getColumns();

                            for (var i = 0, l = oColumns.length; i < l; i++) {
                                if (oColumns[i].getSorted()) {
                                    oColumns[i].setSorted(false);
                                }
                            }
                        }

                        if (this._dataMode === "READ") this._sActiveTable = "headerTab";
                    }
                    else {
                        if (this._dataMode === "READ") this._sActiveTable = "detailTab";
                    }

                    oTable.getModel().getData().rows.forEach(row => row.ACTIVE = "");
                    oTable.getModel().setProperty(sRowPath + "/ACTIVE", "X");

                    oTable.getRows().forEach(row => {
                        if (row.getBindingContext() && row.getBindingContext().sPath.replace("/rows/", "") === sRowPath.replace("/rows/", "")) {
                            row.addStyleClass("activeRow");
                        }
                        else row.removeStyleClass("activeRow")
                    })
                }
            },

            onTableClick(oEvent) {
                var oControl = oEvent.srcControl;
                var sTabId = oControl.sId.split("--")[oControl.sId.split("--").length - 1];

                while (sTabId.substr(sTabId.length - 3) !== "Tab") {                    
                    oControl = oControl.oParent;
                    sTabId = oControl.sId.split("--")[oControl.sId.split("--").length - 1];
                }
                
                if (this._dataMode === "READ") this._sActiveTable = sTabId;
                // console.log(this._sActiveTable);
            },

            filterGlobally: function(oEvent) {
                var oTable = oEvent.getSource().oParent.oParent;
                var sTabId = oTable.sId.split("--")[oTable.sId.split("--").length - 1];
                var sQuery = oEvent.getParameter("query");

                if (sTabId === "headerTab") {
                    this.byId("searchFieldDtl").setProperty("value", "");
                }

                if (this._dataMode === "READ") this._sActiveTable = sTabId;
                this.exeGlobalSearch(sQuery, this._sActiveTable);
            },

            exeGlobalSearch(arg1, arg2) {
                var oFilter = null;
                var aFilter = [];
                
                if (arg1) {
                    this._aColumns[arg2.replace("Tab","")].forEach(item => {
                         if (item.DataType === "BOOLEAN") aFilter.push(new Filter(item.ColumnName, FilterOperator.EQ, arg1));
                        else aFilter.push(new Filter(item.ColumnName, FilterOperator.Contains, arg1));
                    })

                    oFilter = new Filter(aFilter, false);
                }
    
                this.byId(arg2).getBinding("rows").filter(oFilter, "Application");

                if (arg1 && arg2 === "headerTab") {
                    var vASN = this.byId(arg2).getModel().getData().rows.filter((item,index) => index === this.byId(arg2).getBinding("rows").aIndices[0])[0].ASNNO;
                    var vASNDT = this.byId(arg2).getModel().getData().rows.filter((item,index) => index === this.byId(arg2).getBinding("rows").aIndices[0])[0].ASNDT;
                    this.getView().getModel("ui").setProperty("/activeASN", vASN);
                    this.getView().getModel("ui").setProperty("/activeASNDisplay", vASN);

                    this.getView().getModel("ui").setProperty("/activeASNDT", vASNDT);
                    this.getView().getModel("ui").setProperty("/activeASNDTDisplay", vASNDT);

                    this.getDetailData(true);
                }
            },

            formatValueHelp: function(sValue, sPath, sKey, sText, sFormat) {
                // console.log(sValue, sPath, sKey, sText, sFormat);
                var oValue = this.getView().getModel(sPath).getData().filter(v => v[sKey] === sValue);

                if (oValue && oValue.length > 0) {
                    if (sFormat === "Value") {
                        return oValue[0][sText];
                    }
                    else if (sFormat === "ValueKey") {
                        return oValue[0][sText] + " (" + sValue + ")";
                    }
                    else if (sFormat === "KeyValue") {
                        return sValue + " (" + oValue[0][sText] + ")";
                    }
                }
                else return sValue;
            },

            setColumnFilters(sTable) {
                if (me._aColFilters) {
                    var oTable = this.byId(sTable);
                    var oColumns = oTable.getColumns();

                    me._aColFilters.forEach(item => {
                        oColumns.filter(fItem => fItem.getFilterProperty() === item.sPath)
                            .forEach(col => {
                                col.filter(item.oValue1);
                            })
                    })
                } 
            },

            setColumnSorters(sTable) {
                if (me._aColSorters) {
                    var oTable = this.byId(sTable);
                    var oColumns = oTable.getColumns();

                    me._aColSorters.forEach(item => {
                        oColumns.filter(fItem => fItem.getSortProperty() === item.sPath)
                            .forEach(col => {
                                col.sort(item.bDescending);
                            })
                    })
                } 
            },

            onValueHelpRequested: function(oEvent) {
                var aCols = {
                    "cols": [
                        {
                            "label": "Code",
                            "template": "VHTitle",
                            "width": "5rem"
                        },
                        {
                            "label": "Description",
                            "template": "VHDesc"
                        }
                    ]
                }

                var oSource = oEvent.getSource();
                var sModel = this._sActiveTable.replace("Tab","");

                this._inputSource = oSource;
                this._inputId = oSource.getId();
                this._inputValue = oSource.getValue();
                this._inputKey = oSource.getValue();
                this._inputField = oSource.getBindingInfo("value").parts[0].path;
                
                var vColProp = this._aColumns[sModel].filter(item => item.ColumnName === this._inputField);
                var vItemValue = vColProp[0].ValueHelp.items.value;
                var vItemDesc = vColProp[0].ValueHelp.items.text;
                var sPath = vColProp[0].ValueHelp.items.path;
                var vh = this.getView().getModel(sPath).getData();
                var sTextFormatMode = vColProp[0].TextFormatMode === "" ? "Key" : vColProp[0].TextFormatMode;

                vh.forEach(item => {
                    item.VHTitle = item[vItemValue];
                    item.VHDesc = vItemValue === vItemDesc ? "" : item[vItemDesc];

                    if (sTextFormatMode === "Key") {
                        item.VHSelected = this._inputValue === item[vItemValue];
                    }
                    else if (sTextFormatMode === "Value") {
                        item.VHSelected = this._inputValue === item[vItemDesc];
                    }
                    else if (sTextFormatMode === "KeyValue") {
                        item.VHSelected = this._inputValue === (item[vItemValue] + " (" + item[vItemDesc] + ")");
                    }
                    else if (sTextFormatMode === "ValueKey") {
                        item.VHSelected = this._inputValue === (item[vItemDesc] + " (" + item[vItemValue] + ")");
                    }

                    if (item.VHSelected) { this._inputKey = item[vItemValue]; }
                })
                // console.log(this._inputKey)
                vh.sort((a, b) => (a.VHTitle > b.VHTitle ? 1 : -1));

                var oVHModel = new JSONModel({
                    items: vh
                });                

                this._oTableValueHelpDialog = sap.ui.xmlfragment("zuiasn.zuiasn.view.fragments.valuehelp.TableValueHelpDialog", this);
                this.getView().addDependent(this._oTableValueHelpDialog);
                this._oTableValueHelpDialog.setModel(new JSONModel({
                    title: vColProp[0].ColumnLabel,
                }));

                this._oTableValueHelpDialog.getTableAsync().then(function (oTable) {
                    // console.log(oTable.isA(("sap.ui.table.Table")))
                    oTable.setModel(oVHModel);
                    // oTable.setRowHeight(70)

                    if (oTable.bindRows) {
                        oTable.getModel().setProperty("/columns", aCols.cols);

                        //bind the dynamic column to the table
                        oTable.bindColumns("/columns", function (index, context) {
                            // var sColumnId = context.getObject().ColumnName;
                            var sColumnLabel =  context.getObject().label;
                            var sColumnWidth = context.getObject().ColumnWidth;
                            // var sColumnVisible = context.getObject().Visible;
                            // var sColumnSorted = context.getObject().Sorted;
                            // var sColumnSortOrder = context.getObject().SortOrder;
                            // var sColumnDataType = context.getObject().DataType;
        
                            if (sColumnWidth === 0) sColumnWidth = 100;
        
                            var oCtrl = new sap.m.Text({
                                text: "{" + context.getObject().template + "}",
                                wrapping: false
                            })
        
                            return new sap.ui.table.Column({
                                // id: sTabId.replace("Tab", "") + "Col" + sColumnId,
                                label: new sap.m.Text({ text: sColumnLabel }),
                                template: oCtrl,
                                autoResizable: true,
                                width: sColumnWidth
                            });                    
                        });

                        oTable.bindAggregation("rows", "/items");
                    }
    
                    this._oTableValueHelpDialog.update();
                }.bind(this));
    
                var oToken = new Token();
                oToken.setKey(this._inputSource.getSelectedKey());
                oToken.setText(this._inputSource.getValue());
                this._oTableValueHelpDialog.setTokens([oToken]);
                this._oTableValueHelpDialog.open();
            },
            
            onValueHelpOkPress: function (oEvent) {
                var aTokens = oEvent.getParameter("tokens");
    
                if (aTokens.length > 0) {
                    this._inputSource.setSelectedKey(aTokens[0].getKey());
                }
                this._oTableValueHelpDialog.close();
            },
    
            onValueHelpCancelPress: function () {
                this._oTableValueHelpDialog.close();
            },
    
            onValueHelpAfterClose: function () {
                this._oTableValueHelpDialog.destroy();
            },

            onFirstVisibleRowChanged: function (oEvent) {
                var oTable = oEvent.getSource();
                var sTabId = oTable.sId.split("--")[oTable.sId.split("--").length - 1];
                this._sActiveTable = sTabId;

                setTimeout(() => {
                    var oData = oTable.getModel().getData().rows;
                    var iStartIndex = oTable.getBinding("rows").iLastStartIndex;
                    var iLength = oTable.getBinding("rows").iLastLength + iStartIndex;

                    if (oTable.getBinding("rows").aIndices.length > 0) {
                        for (var i = iStartIndex; i < iLength; i++) {
                            var iDataIndex = oTable.getBinding("rows").aIndices.filter((fItem, fIndex) => fIndex === i);
    
                            if (oData[iDataIndex].ACTIVE === "X") oTable.getRows()[iStartIndex === 0 ? i : i - iStartIndex].addStyleClass("activeRow");
                            else oTable.getRows()[iStartIndex === 0 ? i : i - iStartIndex].removeStyleClass("activeRow");
                        }
                    }
                    else {
                        for (var i = iStartIndex; i < iLength; i++) {
                            if (oData[i].ACTIVE === "X") oTable.getRows()[iStartIndex === 0 ? i : i - iStartIndex].addStyleClass("activeRow");
                            else oTable.getRows()[iStartIndex === 0 ? i : i - iStartIndex].removeStyleClass("activeRow");
                        }
                    }
                }, 1);
            },

            onColumnUpdated: function (oEvent) {
                var oTable = oEvent.getSource();
                var sTabId = oTable.sId.split("--")[oTable.sId.split("--").length - 1];
                this._sActiveTable = sTabId;

                this.setActiveRowHighlight();
            },

            onSort: function(oEvent) {
                var oTable = oEvent.getSource();
                var sTabId = oTable.sId.split("--")[oTable.sId.split("--").length - 1];
                this._sActiveTable = sTabId;

                this.setActiveRowHighlight();
            },
            
            onFilter: function(oEvent) {
                var oTable = oEvent.getSource();
                var sTabId = oTable.sId.split("--")[oTable.sId.split("--").length - 1];
                this._sActiveTable = sTabId;
                
                this.setActiveRowHighlight();

                setTimeout(() => {
                    if (this._sActiveTable === "headerTab") {
                        this.getView().getModel("counts").setProperty("/header", this.byId(this._sActiveTable).getBinding("rows").aIndices.length);
                    }
                    else if (this._sActiveTable === "detailTab") {
                        this.getView().getModel("counts").setProperty("/detail", this.byId(this._sActiveTable).getBinding("rows").aIndices.length);
                    } 
                }, 100);
            },

            setActiveRowHighlight(sTableId) {
                var oTable = this.byId(sTableId !== undefined && sTableId !== "" ? sTableId : this._sActiveTable);

                setTimeout(() => {
                    var iActiveRowIndex = oTable.getModel().getData().rows.findIndex(item => item.ACTIVE === "X");

                    oTable.getRows().forEach(row => {
                        if (row.getBindingContext() && +row.getBindingContext().sPath.replace("/rows/", "") === iActiveRowIndex) {
                            row.addStyleClass("activeRow");
                        }
                        else row.removeStyleClass("activeRow");
                    })                    
                }, 100);
            },

            onInputKeyDown(oEvent) {
                if (oEvent.key === "ArrowUp" || oEvent.key === "ArrowDown") {
                    //prevent increase/decrease of number value
                    oEvent.preventDefault();
                    
                    var sTableId = oEvent.srcControl.oParent.oParent.sId;
                    var oTable = this.byId(sTableId);
                    var sColumnName = oEvent.srcControl.getBindingInfo("value").parts[0].path;
                    var sCurrentRowIndex = +oEvent.srcControl.oParent.getBindingContext().sPath.replace("/rows/", "");
                    var sColumnIndex = -1;
                    var sCurrentRow = -1;
                    var sNextRow = -1;
                    var sActiveRow = -1;
                    var iFirstVisibleRowIndex = oTable.getFirstVisibleRow();
                    var iVisibleRowCount = oTable.getVisibleRowCount();

                    oTable.getModel().setProperty(oEvent.srcControl.oParent.getBindingContext().sPath + "/" + oEvent.srcControl.getBindingInfo("value").parts[0].path, oEvent.srcControl.getValue());

                    //get active row (arrow down)
                    oTable.getBinding("rows").aIndices.forEach((item, index) => {
                        if (item === sCurrentRowIndex) { sCurrentRow = index; }
                        if (sCurrentRow !== -1 && sActiveRow === -1) { 
                            if ((sCurrentRow + 1) === index) { sActiveRow = item }
                            else if ((index + 1) === oTable.getBinding("rows").aIndices.length) { sActiveRow = item }
                        }
                    })
                    
                    //clear active row
                    oTable.getModel().getData().rows.forEach(row => row.ACTIVE = "");

                    //get next row to focus and active row (arrow up)
                    if (oEvent.key === "ArrowUp") { 
                        if (sCurrentRow !== 0) {
                            sActiveRow = oTable.getBinding("rows").aIndices.filter((fItem, fIndex) => fIndex === (sCurrentRow - 1))[0];
                        }
                        else { sActiveRow = oTable.getBinding("rows").aIndices[0] }

                        sCurrentRow = sCurrentRow === 0 ? sCurrentRow : sCurrentRow - iFirstVisibleRowIndex;
                        sNextRow = sCurrentRow === 0 ? 0 : sCurrentRow - 1;
                    }
                    else if (oEvent.key === "ArrowDown") { 
                        sCurrentRow = sCurrentRow - iFirstVisibleRowIndex;
                        sNextRow = sCurrentRow + 1;
                    }

                    //set active row
                    oTable.getModel().setProperty("/rows/" + sActiveRow + "/ACTIVE", "X");

                    //auto-scroll up/down
                    if (oEvent.key === "ArrowDown" && (sNextRow + 1) < oTable.getModel().getData().rows.length && (sNextRow + 1) > iVisibleRowCount) {
                        oTable.setFirstVisibleRow(iFirstVisibleRowIndex + 1);
                    }   
                    else if (oEvent.key === "ArrowUp" && sCurrentRow === 0 && sNextRow === 0 && iFirstVisibleRowIndex !== 0) { 
                        oTable.setFirstVisibleRow(iFirstVisibleRowIndex - 1);
                    }

                    //get the cell to focus
                    oTable.getRows()[sCurrentRow].getCells().forEach((cell, index) => {
                        if (cell.getBindingInfo("value") !== undefined) {
                            if (cell.getBindingInfo("value").parts[0].path === sColumnName) { sColumnIndex = index; }
                        }
                    })
                    
                    if (oEvent.key === "ArrowDown") {
                        sNextRow = sNextRow === iVisibleRowCount ? sNextRow - 1 : sNextRow;
                    }

                    //set focus on cell
                    setTimeout(() => {
                        oTable.getRows()[sNextRow].getCells()[sColumnIndex].focus();
                        oTable.getRows()[sNextRow].getCells()[sColumnIndex].getFocusDomRef().select();
                    }, 100);

                    //set row highlight
                    this.setActiveRowHighlight();
                }
            },

            onKeyDown(oEvent) {           
                console.log(oEvent);
            },

            onTableResize: function(oEvent) {
                var oSplitter = this.byId("splitterMain");
                var oHeaderPane = oSplitter.getRootPaneContainer().getPanes().at(0);
                var oDetailPane = oSplitter.getRootPaneContainer().getPanes().at(1);
                var vFullScreen = oEvent.getSource().data("Fullscreen") === "1" ? true : false;
                var vPart = oEvent.getSource().data("Part");
                var vHeaderSize = oEvent.getSource().data("HeaderSize");
                var vDetailSize = oEvent.getSource().data("DetailSize");

                this._sActiveTable = oEvent.getSource().data("TableId");
                this.getView().getModel("ui").setProperty("/fullscreen/" + vPart, vFullScreen);
                this.byId("smartFilterBar").setVisible(!vFullScreen);

                var oHeaderLayoutData = new sap.ui.layout.SplitterLayoutData({
                    size: vHeaderSize,
                    resizable: false
                });

                var oDetailLayoutData = new sap.ui.layout.SplitterLayoutData({
                    size: vDetailSize,
                    resizable: false
                });

                oHeaderPane.setLayoutData(oHeaderLayoutData);
                oDetailPane.setLayoutData(oDetailLayoutData);
            },

            onWrapText: function(oEvent) {
                this._sActiveTable = oEvent.getSource().data("TableId");
                var vWrap = this.getView().getModel("ui").getData().dataWrap[this._sActiveTable];
                
                this.byId(this._sActiveTable).getColumns().forEach(col => {
                    var oTemplate = col.getTemplate();
                    oTemplate.setWrapping(!vWrap);
                    col.setTemplate(oTemplate);
                })

                this.getView().getModel("ui").setProperty("/dataWrap/" + [this._sActiveTable], !vWrap);
            },

            suggestionRowValidator: function (oColumnListItem) {
                var aCells = oColumnListItem.getCells();

                if (aCells.length === 1) {
                    return new sap.ui.core.Item({
                        key: aCells[0].getText(),
                        text: aCells[0].getText()
                    }); 
                }
                else {
                    return new sap.ui.core.Item({
                        key: aCells[0].getText(),
                        text: aCells[1].getText()
                    });
                }
            },

            onSaveTableLayout: function (oEvent) {
                //saving of the layout of table
                this._sActiveTable = oEvent.getSource().data("TableId");
                var oTable = this.byId(this._sActiveTable);
                var oColumns = oTable.getColumns();
                var vSBU = "VER"; //this.getView().getModel("ui").getData().sbu;
                var me = this;
                var ctr = 1;

                var oParam = {
                    "SBU": vSBU,
                    "TYPE": this._oTableLayout[this._sActiveTable].type,
                    "TABNAME": this._oTableLayout[this._sActiveTable].tabname,
                    "TableLayoutToItems": []
                };

                //get information of columns, add to payload
                oColumns.forEach((column) => {
                    oParam.TableLayoutToItems.push({
                        // COLUMNNAME: column.sId,
                        COLUMNNAME: column.mProperties.sortProperty,
                        ORDER: ctr.toString(),
                        SORTED: column.mProperties.sorted,
                        SORTORDER: column.mProperties.sortOrder,
                        SORTSEQ: "1",
                        VISIBLE: column.mProperties.visible,
                        WIDTH: column.mProperties.width.replace('px',''),
                        WRAPTEXT: this.getView().getModel("ui").getData().dataWrap[this._sActiveTable] === true ? "X" : ""
                    });

                    ctr++;
                });

                console.log(oParam)

                //call the layout save
                var oModel = this.getOwnerComponent().getModel("ZGW_3DERP_COMMON_SRV");

                oModel.create("/TableLayoutSet", oParam, {
                    method: "POST",
                    success: function(data, oResponse) {
                        MessageBox.information(me.getView().getModel("ddtext").getData()["INFO_LAYOUT_SAVE"]);
                    },
                    error: function(err) {
                        MessageBox.error(err);
                    }
                });                
            },

            //******************************************* */
            // Column Filtering
            //******************************************* */

            onColFilterClear: function(oEvent) {
                TableFilter.onColFilterClear(oEvent, this);
            },

            onColFilterCancel: function(oEvent) {
                TableFilter.onColFilterCancel(oEvent, this);
            },

            onColFilterConfirm: function(oEvent) {
                TableFilter.onColFilterConfirm(oEvent, this);
            },

            onFilterItemPress: function(oEvent) {
                TableFilter.onFilterItemPress(oEvent, this);
            },

            onFilterValuesSelectionChange: function(oEvent) {
                TableFilter.onFilterValuesSelectionChange(oEvent, this);
            },

            onSearchFilterValue: function(oEvent) {
                TableFilter.onSearchFilterValue(oEvent, this);
            },

            onCustomColFilterChange: function(oEvent) {
                TableFilter.onCustomColFilterChange(oEvent, this);
            },

            onSetUseColFilter: function(oEvent) {
                TableFilter.onSetUseColFilter(oEvent, this);
            },

            onRemoveColFilter: function(oEvent) {
                TableFilter.onRemoveColFilter(oEvent, this);
            },

            //******************************************* */
            // Smart Filter
            //******************************************* */

            setSmartFilterModel: function () {
                var oModel = this.getOwnerComponent().getModel("ZVB_3DERP_ASN_FILTERS_CDS");               
                var oSmartFilter = this.getView().byId("smartFilterBar");
                oSmartFilter.setModel(oModel);
            },

            beforeVariantFetch: function(oEvent) {
                SmartFilterCustomControl.beforeVariantFetch(this);
            },

            afterVariantLoad: function(oEvent) {
                SmartFilterCustomControl.afterVariantLoad(this);
            },

            clearSmartFilters: function(oEvent) {
                SmartFilterCustomControl.clearSmartFilters(this);
            },

            //******************************************* */
            // Functions
            //******************************************* */

            formatTimeOffSet(pTime) {
                let TZOffsetMs = new Date(0).getTimezoneOffset() * 60 * 1000;
                return timeFormat.format(new Date(pTime + TZOffsetMs));
            }

        });
    });
