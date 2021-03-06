﻿import * as $ from "jquery";
import * as ko from "knockout";
import * as toastr from "toastr";
import * as swal from "sweetalert";

import { Common } from "../../common/common";

import "jqueryPager";
import "resourceCommon";

import { RolesSettingModel, IRolesSetting } from "../../models/rolesettings/rolesettings-model";

//declare var listdeparments;

class RolesSettingViewModel {
    private totalPage: number = 0;
    private currentPage: number = 1;
    private recordPerPage: number = window.pageSize;
    private common: Common;

    keyword: KnockoutObservable<string> = ko.observable("");
    isSearching: KnockoutObservable<boolean> = ko.observable(false);
    isShowAddOrEdit: KnockoutObservable<boolean> = ko.observable(false);

    listRolesSetting: KnockoutObservableArray<IRolesSetting> = ko.observableArray([]);

    eid: KnockoutObservable<string> = ko.observable("");
    code: KnockoutObservable<string> = ko.observable("");
    name: KnockoutObservable<string> = ko.observable("");
    description: KnockoutObservable<string> = ko.observable("");
    status: KnockoutObservable<boolean> = ko.observable(true);

    isFocusName: KnockoutObservable<boolean> = ko.observable(false);
    isSending: KnockoutObservable<boolean> = ko.observable(false);
    isAdd: KnockoutObservable<boolean> = ko.observable(false);

    title: string = " 'Quyền truy cập' "; // window.resources.admin.salon.title.name;

    private model: RolesSettingModel;
    private updateCallback: Function;

    constructor() {
        this.model = new RolesSettingModel();
        this.common = new Common();

        $(() => {
            //this.common.renderPage(this.title, 1, this.recordPerPage, listSalons.totalRecord, this.pageClickSearch);
            this.search(1);
        });
    }

    formSearch() {
        this.search(1);
    }

    search(page: number) {
        this.currentPage = page;
        this.isSearching(true);
        this.model.load((data) => {
            this.isSearching(false);
            this.listRolesSetting(data);
            //this.common.renderPage(this.title, page, this.recordPerPage, data.totalRecord, this.pageClickSearch);
        });
    }

    save() {
        if (!$("#addOrEditForm form").valid()) {
            return;
        }

        this.isSending(true);

        this.model.update({
            eid: this.eid(), code: this.code(), name: this.name(), description: this.description(), status: this.status()
        }, (data) => {
            this.isSending(false);

            if ($.isArray(data)) {
                toastr.error((<string[]>data).join("<br>"));
                return;
            }

            if (data === -2) {
                //toastr.warning(this.common.stringFormat(window.resources.common.message.alreadyExist, window.resources.admin.salon.title.infoWindowTitle));
                return;
            }
            if (data === -3) {
                //toastr.warning(this.common.stringFormat(window.resources.common.message.notExist, window.resources.admin.salon.title.stateProvince));
                return;
            }
            if (data > 0) {
                toastr.success('Succefull');
                this.resetForm();
                //this.updateCallback();
                $("#addOrEditForm").modal('hide');
                this.search(1);
            }
        });
        return;
    }

    pageClickSearch(pageclickednumber: number) {
        this.search(pageclickednumber);
    }

    showAdd(updateCallback: Function) {
        this.isAdd(true);
        this.resetForm();
        this.updateCallback = updateCallback;
        $("#addOrEditForm").modal('show');
    }

    closeAddOrEdit = () => {
        this.isShowAddOrEdit(false);
    }

    showEdit = (item, updateCallback: Function) => {
        this.isAdd(false);
        this.eid(item.EID);
        this.code(item.Code);
        this.name(item.Name);
        this.description(item.Des);
        this.updateCallback = updateCallback;
        $("#addOrEditForm").modal('show');
    }

    delete = (item) => {
        swal({
            title: this.common.stringFormat(window.resources.common.message.confirmDelete, this.title),
            text: "",
            type: "warning",
            showCancelButton: true,
            confirmButtonText: window.resources.common.button.ok,
            cancelButtonText: window.resources.common.button.cancel,
            closeOnConfirm: true,
            closeOnCancel: true
        }, (isConfirm) => {
            if (isConfirm) {
                this.common.blockUI({ target: "#list", animate: true });

                this.model.delete(item.id, window.token, (data) => {
                    if (data === -1) {
                        toastr.warning(this.common.stringFormat(window.resources.common.message.notExist, this.title));
                        return;
                    }
                    if (data > 0) {
                        toastr.success(this.common.stringFormat(window.resources.common.message.deleteSuccess, this.title));
                    }
                });
            }
        });
    }
    resetForm() {
        this.eid("");
        this.code("");
        this.name("");
        this.description("");
        //setTimeout(() => { this.isFocusName(true); }, 100);
    }
}

window.viewModel = new RolesSettingViewModel();
ko.applyBindings(window.viewModel, document.getElementById("page-content"));