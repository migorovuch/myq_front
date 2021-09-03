<template>
  <b-container>
    <div class="row">
      <div class="col-lg-4 col-sm-6 col-xs-12">
        <b-form-group :label="$t('views_client.Name')">
          <b-form-input type="text" v-model="filter.name" @change="applyListFilter" />
        </b-form-group>
      </div>
      <div class="col-lg-4 col-sm-6 col-xs-12">
        <b-form-group :label="$t('views_client.Phone')">
          <b-form-input type="text" v-model="filter.phone" @change="applyListFilter" />
        </b-form-group>
      </div>
      <div class="col-lg-4 col-sm-6 col-xs-12">
        <b-form-group :label="$t('views_client.Status')">
          <b-form-select :options="statusOptions" @change="changeStatusFilter" :model="filter.status" :value="filter.status"></b-form-select>
        </b-form-group>
      </div>
    </div>
    <b-table
        striped
        hover
        :items="tableItems"
        :fields="tableFields"
        @row-clicked="rowClicked">
      <template #cell(status)="data">
        <span :class="getStatusColor(data.value)">{{getStatusLabel(data.value)}}</span>
      </template>
      <template #cell(phone)="data">
        <a :href="'tel:'+data.item.phone">{{ data.item.phone }}</a>
      </template>
      <template #cell(name)="data">
        <span v-if="data.item.name === data.item.pseudonym || !data.item.pseudonym || (data.item.pseudonym && !data.item.pseudonym.trim())">{{data.item.name}}</span>
        <div v-else><span>{{data.item.pseudonym}}</span> <span>({{data.item.name}})</span></div>
      </template>
      <template #row-details="row">
        <div class="row text-center">
          <div class="col-12 col-sm-4">
            <b-input-group>
              <b-form-input v-model="row.item.pseudonym" :placeholder="$t('views_client.Enter client pseudonym')"></b-form-input>
              <b-input-group-append>
                <b-button variant="outline-success" @click="changeItem(row.item, 'pseudonym')">
                  <b-icon icon="check2"></b-icon>
                </b-button>
              </b-input-group-append>
            </b-input-group>
          </div>
          <div class="col-12 col-sm-4 pb-3 pb-sm-0 pt-3 pt-sm-2">
            <router-link :to="{name: 'company_bookings', query:{client: row.item.id}}">
              {{$t("views_client.Number of bookings")+': '+row.item.numberOfBookings}}
            </router-link>
          </div>
          <div class="col-12 col-sm-4">
            <b-button v-if="row.item.status!==1" variant="outline-success" @click="row.item.status=1;changeItem(row.item, 'status');">{{ $t("views_client.Enable client") }}</b-button>
            <b-button v-else variant="outline-danger" @click="row.item.status=2;changeItem(row.item, 'status')">{{ $t("views_client.Disable client") }}</b-button>
          </div>
        </div>
      </template>
    </b-table>
    <div class="row">
      <div class="col-sm-4 col-xs-12">
        <b-form-group
            :label="$t('views_client.Per page')"
            label-for="per-page-select"
            label-cols-sm="6"
            label-cols-md="4"
            label-cols-lg="3"
            label-align-sm="right"
            label-size="sm"
            class="mb-0"
        >
          <b-form-select
              id="per-page-select"
              v-model="perPage"
              :options="pageOptions"
              @input="applyListFilter"
              size="sm"
          ></b-form-select>
        </b-form-group>
      </div>
      <div class="col-sm-4 col-xs-12">

      </div>
      <div class="col-sm-4 col-xs-12 m-auto" v-if="totalRows > perPage">
        <b-pagination
            v-model="currentPage"
            :total-rows="totalRows"
            :per-page="perPage"
            @input="applyListFilter"
            align="fill"
            size="sm"
            class="my-0"
        ></b-pagination>
      </div>
    </div>
  </b-container>
</template>

<script>

import {mapActions, mapGetters, mapMutations} from "vuex";
import Vue from "vue";

export default {
  name: "ClientsList",
  created() {
    this.loadMyCompany({
      successCallback: (company) => {
        if (Object.keys(company).length !== 0) {
          this.filter.company = company.id;
          this.applyListFilter();
        }
      }
    });
  },
  data() {
    return {
      tableFields: [
        {key: 'name', label: this.$t('views_client.Name')},
        {key: 'Phone', label: this.$t('views_client.Phone')},
        {key: 'status', label: this.$t('views_client.Status')}
      ],
      filter: {
        name: '',
        phone: '',
        company: '',
        status: '',
      },
      statusOptions: [
        {value: '', text:''},
        {value: '0', text: this.$t('views_client.Unapproved')},
        {value: '1', text: this.$t('views_client.Approved')},
        {value: '2', text: this.$t('views_client.Deactivated')},
      ],
      tableItems: [],
      perPage: 20,
      pageOptions: [5, 20, 50, 100],
      currentPage: 1,
      totalRows: 0
    };
  },
  methods: {
    ...mapGetters('company', {
      getCompany: 'getModel'
    }),
    ...mapActions('company', {
      loadMyCompany: 'loadMyCompany',
    }),
    ...mapGetters('client', {
      getClients: 'getList'
    }),
    ...mapActions('client', {
      loadMyClients: 'load',
    }),
    ...mapActions('client', {
      changeClient: 'change',
    }),
    getStatusColor(status) {
      let colors = {
        0: '',
        1: 'text-success',
        2: 'text-danger',
      };

      return colors[status];
    },
    getStatusLabel(status) {
      let labels = {
        0: this.$t('views_client.Unapproved'),
        1: this.$t('views_client.Approved'),
        2: this.$t('views_client.Deactivated'),
      };

      return labels[status];
    },
    changeStatusFilter(value) {
      this.filter.status = value;
      this.applyListFilter();
    },
    rowClicked(item, index, event) {
      Vue.set(item, '_showDetails', !item._showDetails);
      this.$emit('row-clicked',item, index, event);
    },
    statusChange(row, status) {
      let item = row.item;
      Vue.set(item, 'status', status);
    },
    changeItem(item, property) {
      let data = {};
      data[property] = item[property];
      this.changeClient({
        id: item.id,
        data,
        successCallback: (client) => {
          this.$root.$bvToast.toast(this.$t('views_client.Successfully saved'), {
            toaster: 'b-toaster-bottom-left',
            appendToast: true,
            autoHideDelay: 4000
          });
        }
      })
    },
    applyListFilter() {
      let filter = {
        company: this.filter.company
      };
      for (let filterKey in this.filter) {
        if (this.filter[filterKey] && this.filter[filterKey] !== '' && filterKey !== 'status' && filterKey !== 'company') {
          filter[filterKey] = '%' + this.filter[filterKey] + '%';
        }
      }
      if (!this.filter.status.isEmpty()) {
        filter.status = this.filter.status;
      }
      filter['page'] = {
        limit: this.perPage,
        offset: (this.currentPage - 1) * this.perPage
      };
      this.loadMyClients({
        filter,
        successCallback: (data) => {
          if ('data' in data && 'total' in data) {
            this.tableItems = data.data;
            this.totalRows = data.total;
          }
        }
      });
    }
  }
}
</script>

<style scoped>

</style>
