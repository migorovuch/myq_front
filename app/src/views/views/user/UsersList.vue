<template>
  <CCardBody>
    <CDataTable
        :items="getUsersList()"
        :fields="fields"
        items-per-page-select
        :items-per-page="perPage"
        hover
        sorter
        :pagination="paginationConfig"
        @page-change="applyUsersFilter"
    >
      <template #status="{item}">
        <td>
          <CBadge :color="getStatusBadge(item.status)">
            {{getStatusLabel(item.status)}}
          </CBadge>
        </td>
      </template>
      <template #show_details="{item, index}">
        <td class="py-2">
          <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              @click="toggleDetails(item, index)"
          >
            {{Boolean(item._toggled) ? $t('view_user_dashboard.Hide') : $t('view_user_dashboard.Show')}}
          </CButton>
          <CButton
              color="primary"
              variant="outline"
              square
              size="sm"
              :to="{name: 'dashboard_user_edit', params: {'id': item.id}}"
          >
            {{ $t('view_user_dashboard.Edit') }}
          </CButton>
        </td>
      </template>
      <template #details="{item}">
        <CCollapse :show="Boolean(item._toggled)" :duration="collapseDuration">
          <div class="row">
            <div class="col">
              <b>Id:</b> {{item.id}}
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3 col-6">
              <b>{{$t('view_user_dashboard.Email')}}:</b> {{item.email}}
            </div>
            <div class="col-lg-3 col-6">
              <b>{{$t('view_user_dashboard.Nickname')}}:</b> {{item.nickname}}
            </div>
            <div class="col-lg-3 col-6">
              <b>{{$t('view_user_dashboard.Roles')}}:</b> {{item.roles}}
            </div>
            <div class="col-lg-3 col-6">
              <b>{{$t('view_user_dashboard.Created')}}:</b> {{item.dateCreate}}
            </div>
            <div class="col-lg-3 col-6">
              <b>{{$t('view_user_dashboard.Updated')}}:</b> {{item.dateUpdate}}
            </div>
          </div>
        </CCollapse>
      </template>
    </CDataTable>
  </CCardBody>
</template>

<script>

import {CCardBody, CDataTable, CCollapse, CButton, CBadge} from '@coreui/vue';
import {mapActions, mapGetters, mapMutations} from "vuex";

export default {
  name: "UsersList",
  components: {CCardBody, CDataTable, CCollapse, CButton, CBadge},
  data() {
    return {
      perPage: 5,
      totalRows: 100,
      currentPage: 1,
      paginationConfig: false,
      collapseDuration: 0,
      fields: [
        { key: 'fullName' },
        { key: 'phone' },
        { key: 'status' },
        {
          key: 'show_details',
          label: '',
          // _style: 'width:1%',
          sorter: false,
          filter: false
        }
      ]
    };
  },
  created() {
    this.setBreadcrumbItems([
        {
          text: this.$t('layouts_dashboard.Dashboard'),
          to: {name: 'dashboard_home'}
        },
        {
          text: this.$t('view_user_dashboard.Users list'),
          to: {name: 'dashboard_users'}
        }
    ]);
    this.applyUsersFilter();
  },
  methods: {
    ...mapGetters('user', {
      getUsersList: 'getList',
    }),
    ...mapActions('user', {
      loadUsersList: 'load',
    }),
    ...mapMutations('dashboard', {
      setBreadcrumbItems: 'setBreadcrumbItems',
    }),
    getStatusBadge(status) {
      let labels = {
        0: 'secondary',
        1: 'success',
      };

      return labels[status];
    },
    getStatusLabel(status) {
      let labels = {
        0: this.$t('view_user_dashboard.Inactive'),
        1: this.$t('view_user_dashboard.Active'),
      };

      return labels[status];
    },

    getUsersFilter() {
      let filter = {};
      filter['page'] = {
        limit: this.perPage,
        offset: (this.currentPage - 1) * this.perPage
      };

      return filter;
    },
    applyUsersFilter() {
      this.loadUsersList({
        filter: this.getUsersFilter(),
        successCallback: (data) => {
          for (let user of data.data) {
            user.dateCreate = new Date(user.dateCreate).sformat('yyyy-mm-dd HH:MM');
            user.dateUpdate = new Date(user.dateUpdate).sformat('yyyy-mm-dd HH:MM');
          }
          this.items = data.data;
          this.$totalRows = data.total;
          this.paginationConfig = (data.total < this.perPage) ?
              false :
              {activePage: this.currentPage, pages: (data.total / this.perPage)}
        }
      });
    },
    toggleDetails(item) {
      item._toggled = !item._toggled;
      this.collapseDuration = 300;
      this.$nextTick(() => {
        this.collapseDuration = 0
      })
    },
  }
}
</script>

<style scoped>

</style>
