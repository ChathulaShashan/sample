sap.ui.controller("com.heco.zmwfsm.crewmgmt.ext.controller.ObjectPageExt", {

    /** 
      * Event handler for the press event of add button in Team Table toolbar.
      * To add multiple resource to team.
      * @param {sap.ui.base.Event} oEvent The press event.
      * @public
      */
    onPressCreateTeamMember: function (oEvent) {

        if (!this.oAddTeamMemberDialog) {
            if (!this.oTeamMemberSmartTable) {
                this.oTeamMemberSmartTable = this._createSmartTable("VH_Personnels", "smartFilterBar");
            }
            this.oAddTeamMemberDialog = new sap.m.Dialog({
                title: this.getView().getModel("i18n").getResourceBundle().getText("Resource"),
                contentWidth: "100%",
                contentHeight: "100%",
                resizable: true,
                content: new sap.m.VBox({
                    items: [
                        new sap.ui.comp.smartfilterbar.SmartFilterBar({
                            "id": "smartFilterBar",
                            "enableBasicSearch": true,
                            "entitySet": "VH_Personnels"
                        }),
                        this.oTeamMemberSmartTable
                    ]
                }),
                buttons: [new sap.m.Button({
                    text: this.getView().getModel("i18n").getResourceBundle().getText("Add"),
                    type: 'Emphasized',
                    press: function () {
                        var oModel = this.getView().getBindingContext().getModel();
                        var sPath = this.getView().getBindingContext().getPath();
                        var aSelectedSmartTableItems = this.oTeamMemberSmartTable.getTable().getSelectedItems();
                        aSelectedSmartTableItems.forEach(function (oSelectedTableItem) {
                            var oEntry = {};
                            oEntry.properties = {};
                            oEntry.properties.PersonnelNo = oSelectedTableItem.getBindingContext().getProperty("ID");
                            oEntry.properties.Name = oSelectedTableItem.getBindingContext().getProperty("Name");
                            oModel.createEntry(sPath + "/ToTeamMembers", oEntry);
                        });
                        oModel.submitChanges();
                        this.getView().getModel().refresh();
                        this.oAddTeamMemberDialog.close();
                    }.bind(this)
                }),
                new sap.m.Button({
                    text: this.getView().getModel("i18n").getResourceBundle().getText("Cancel"),
                    press: function () {
                        this.oAddTeamMemberDialog.close();
                    }.bind(this)
                })
                ]
            });

            this.getView().addDependent(this.oAddTeamMemberDialog);
        }
        this.oTeamMemberSmartTable.getTable().removeSelections();
        this.oAddTeamMemberDialog.open();
    },

    /* =========================================================== */
    /* Private function                                            */
    /* =========================================================== */
    /** 
      * Function for constructing smart table.
      * To create a smart table
      * @param {string} sEntity The entity set name.
      * @param {string} sSmartFilterID The smart filter ID.
      * @private
      * @return {sap.ui.comp.smarttable.SmartTable} The smart table control.
      */

    _createSmartTable: function (sEntity, sSmartFilterID) {
        return new sap.ui.comp.smarttable.SmartTable({
            "enableAutoBinding": false,
            "entitySet": sEntity,
            "smartFilterId": sSmartFilterID,
            "tableType": "ResponsiveTable",
            "items": [
                new sap.m.Table({
                    "mode": "MultiSelect"
                })
            ]
        }).addStyleClass("sapUiResponsiveContentPadding");
    }

});