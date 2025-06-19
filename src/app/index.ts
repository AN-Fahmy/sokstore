import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { toggleAnimation } from 'src/app/shared/animations';
import { DashboardService } from './service/dashboard/dashboard.service';
import { SalesoperationService } from './service/sales-operation/salesoperation.service';

interface ISummary {
  date: string;
  totalSales: number;
  totalReturns: number;
  totalExpenses: number;
  netProfit: number;
  pureNetProfit: number;
}

@Component({
    templateUrl: './index.html',
    animations: [toggleAnimation],
})
export class IndexComponent implements OnInit{
    private readonly _DashboardService = inject(DashboardService)
    private readonly _SalesoperationService = inject(SalesoperationService)

    allSuppliers:any[] = []
    allDataInChart:any[] = []
    allFilterDateInChart:any[] = []
    allSellingByCategories:any[] = []
    ordersAmountByDays:any[] = []
    allSalesOperations:any[] = []
    totalOrdersAmount:any[] = []
    allSummaryReport:any[] = []
    totalSalesAmount:number = 0
    totalSalesAmountToday:number = 0
    totlExpenses:number = 0
    topCategories:number = 0
    filterNumber:number = 1

    ngOnInit(): void {
        this.getChartDashboard(1)
        this.getTopCategorySelling()
        this.getTotalOrderAmountByDays()
        this.getAllSalesOerations()
        this.getSummaryReport()
    }

    getChartDashboard(filterNum:number):void{
        this.filterNumber = filterNum
        let data = {
            filter : filterNum
        }
        this._DashboardService.ChartDashboard(data).subscribe({
            next:(res)=>{
                this.allDataInChart = res.data.data
                this.totalSalesAmountToday = res.data.totalTodayOrderAmount
                this.allFilterDateInChart = this.allDataInChart.map((date:any) => date.period)
                this.initCharts()
            }
        })
    }

    getTotalOrderAmountByDays():void{
        let data = {
            filter : 1
        }
        this._DashboardService.ChartDashboard(data).subscribe({
            next:(res)=>{
                this.ordersAmountByDays = res.data.data
                this.initCharts()
            }
        })
    }

    getTopCategorySelling():void{
        this._DashboardService.GetTopCategorySelling().subscribe({
            next:(res)=>{
                this.allSellingByCategories = res.data.topCategories
                this.totalSalesAmount = res.data.totalOrderAmount
                this.totlExpenses = res.data.totlExpenses
                this.initCharts()
            }
        })
    }

    getAllSalesOerations():void{
        this._SalesoperationService.getAllSalesOperations().subscribe({
            next:(res)=>{
                this.allSalesOperations = res.data
            }
        })
    }

    getSummaryReport():void{
        this._DashboardService.SummaryReport().subscribe({
            next:(res)=>{
                this.allSummaryReport = res.data
                this.filteredSummary = [...this.allSummaryReport];
            }
        })
    }

    filteredSummary: ISummary[] = [...this.allSummaryReport];
    searchTerm: string = '';
    sortColumn: keyof ISummary = 'date';
    sortDirection: 'asc' | 'desc' = 'asc';

    filterSummary() {
        const term = this.searchTerm.trim().toLowerCase();
        this.filteredSummary = this.allSummaryReport.filter(summary => {
            return (
                summary.date.toLowerCase().includes(term) ||
                summary.totalSales.toLowerCase().includes(term)
            );
        });

        this.sort();
    }
    sortBy(column: keyof ISummary) {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }
        this.sort();
    }
    sort() {
        this.filteredSummary.sort((a, b) => {
            const valueA = a[this.sortColumn];
            const valueB = b[this.sortColumn];

            if (typeof valueA === 'string' && typeof valueB === 'string') {
            return this.sortDirection === 'asc'
                ? valueA.localeCompare(valueB)
                : valueB.localeCompare(valueA);
            }

            if (typeof valueA === 'number' && typeof valueB === 'number') {
            return this.sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
            }

            return 0;
        });
    }

    store: any;
    revenueChart: any;
    salesByCategory: any;
    dailySales: any;
    totalOrders: any;
    isLoading = true;
    constructor(public storeData: Store<any>) {
        this.initStore();
        this.isLoading = false;
    }

    async initStore() {
        this.storeData
            .select((d) => d.index)
            .subscribe((d) => {
                const hasChangeTheme = this.store?.theme !== d?.theme;
                const hasChangeLayout = this.store?.layout !== d?.layout;
                const hasChangeMenu = this.store?.menu !== d?.menu;
                const hasChangeSidebar = this.store?.sidebar !== d?.sidebar;

                this.store = d;

                if (hasChangeTheme || hasChangeLayout || hasChangeMenu || hasChangeSidebar) {
                    if (this.isLoading || hasChangeTheme) {
                        this.initCharts(); //init charts
                    } else {
                        setTimeout(() => {
                            this.initCharts(); // refresh charts
                        }, 300);
                    }
                }
            });
    }

    initCharts() {
        const isDark = this.store.theme === 'dark' || this.store.isDarkMode ? true : false;
        const isRtl = this.store.rtlClass === 'rtl' ? true : false;

        // revenue
        this.revenueChart = {
            chart: {
                height: 325,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                curve: 'smooth',
                width: 2,
                lineCap: 'square',
            },
            dropShadow: {
                enabled: true,
                opacity: 0.2,
                blur: 10,
                left: -7,
                top: 22,
            },
            colors: isDark ? ['#2196f3', '#e7515a'] : ['#1b55e2', '#e7515a'],
            markers: {
                discrete: [
                    {
                        seriesIndex: 0,
                        dataPointIndex: 6,
                        fillColor: '#1b55e2',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                    {
                        seriesIndex: 1,
                        dataPointIndex: 5,
                        fillColor: '#e7515a',
                        strokeColor: 'transparent',
                        size: 7,
                    },
                ],
            },
            labels: [...this.allFilterDateInChart],
            xaxis: {
                axisBorder: {
                    show: false,
                },
                axisTicks: {
                    show: false,
                },
                crosshairs: {
                    show: true,
                },
                labels: {
                    offsetX: isRtl ? 2 : 0,
                    offsetY: 5,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-xaxis-title',
                    },
                },
            },
            yaxis: {
                labels: {
                    formatter: (value: number) => {
                        return  'جنية ' + value;
                    },
                    offsetX: isRtl ? -30 : -10,
                    offsetY: 0,
                    style: {
                        fontSize: '12px',
                        cssClass: 'apexcharts-yaxis-title',
                    },
                },
                opposite: isRtl ? true : false,
            },
            grid: {
                borderColor: isDark ? '#191e3a' : '#e0e6ed',
                strokeDashArray: 5,
                xaxis: {
                    lines: {
                        show: true,
                    },
                },
                yaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            legend: {
                position: 'top',
                horizontalAlign: 'right',
                fontSize: '16px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                itemMargin: {
                    horizontal: 10,
                    vertical: 5,
                },
            },
            tooltip: {
                marker: {
                    show: true,
                },
                x: {
                    show: false,
                },
            },
            fill: {
                type: 'gradient',
                gradient: {
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: isDark ? 0.19 : 0.28,
                    opacityTo: 0.05,
                    stops: isDark ? [100, 100] : [45, 100],
                },
            },
            series: [
                {
                    name: 'قيمة المكاسب',
                    data: [...this.allDataInChart.map((amount)=> amount.totalOrderAmount)],
                },
                {
                    name: 'قيمة المصروفات',
                    data: [...this.allDataInChart.map((amount)=> amount.totalReturnAmount)],
                },
            ],
        };

        // sales by category
        this.salesByCategory = {
            chart: {
                type: 'donut',
                height: 460,
                fontFamily: 'Nunito, sans-serif',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 25,
                colors: isDark ? '#0e1726' : '#fff',
            },
            colors: isDark ? ['#5c1ac3', '#e2a03f', '#e7515a', '#e2a03f'] : ['#e2a03f', '#5c1ac3', '#e7515a', '#471396'],
            legend: {
                position: 'bottom',
                horizontalAlign: 'center',
                fontSize: '14px',
                markers: {
                    width: 10,
                    height: 10,
                    offsetX: -2,
                },
                height: 50,
                offsetY: 20,
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        background: 'transparent',
                        labels: {
                            show: true,
                            name: {
                                show: true,
                                fontSize: '29px',
                                offsetY: -10,
                            },
                            value: {
                                show: true,
                                fontSize: '26px',
                                color: isDark ? '#bfc9d4' : undefined,
                                offsetY: 16,
                                formatter: (val: any) => {
                                    return val;
                                },
                            },
                            total: {
                                show: true,
                                label: 'الإجمالي',
                                color: '#888ea8',
                                fontSize: '29px',
                                formatter: (w: any) => {
                                    return w.globals.seriesTotals.reduce(function (a: any, b: any) {
                                        return a + b;
                                    }, 0);
                                },
                            },
                        },
                    },
                },
            },
            labels: [...this.allSellingByCategories.map((selling:any)=> selling.categoryName)],
            states: {
                hover: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
                active: {
                    filter: {
                        type: 'none',
                        value: 0.15,
                    },
                },
            },
            series: [...this.allSellingByCategories.map((selling:any)=> selling.totalAmount)],
        };

        // daily sales
        this.dailySales = {
            chart: {
                height: 160,
                type: 'bar',
                fontFamily: 'Nunito, sans-serif',
                toolbar: {
                    show: false,
                },
                stacked: true,
                stackType: '100%',
            },
            dataLabels: {
                enabled: false,
            },
            stroke: {
                show: true,
                width: 1,
            },
            colors: ['#e2a03f', '#e0e6ed'],
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        legend: {
                            position: 'bottom',
                            offsetX: -10,
                            offsetY: 0,
                        },
                    },
                },
            ],
            xaxis: {
                labels: {
                    show: false,
                },
                categories: [...this.allFilterDateInChart],
            },
            yaxis: {
                show: false,
            },
            fill: {
                opacity: 1,
            },
            plotOptions: {
                bar: {
                    horizontal: false,
                    columnWidth: '25%',
                },
            },
            legend: {
                show: false,
            },
            grid: {
                show: false,
                xaxis: {
                    lines: {
                        show: false,
                    },
                },
                padding: {
                    top: 10,
                    right: -20,
                    bottom: -20,
                    left: -20,
                },
            },
            series: [
                {
                    name: 'المبيعات',
                    data: [...this.ordersAmountByDays.map((amount:any)=> amount.totalOrderAmount)],
                },
                {
                    name: 'Last Week',
                    data: [0, 0, 0, 0, 0, 0, 0],
                },
            ],
        };

        // total orders
        this.totalOrders = {
            chart: {
                height: 290,
                type: 'area',
                fontFamily: 'Nunito, sans-serif',
                sparkline: {
                    enabled: true,
                },
            },
            stroke: {
                curve: 'smooth',
                width: 2,
            },
            colors: isDark ? ['#00ab55'] : ['#00ab55'],
            labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
            yaxis: {
                min: 0,
                show: false,
            },
            grid: {
                padding: {
                    top: 125,
                    right: 0,
                    bottom: 0,
                    left: 0,
                },
            },
            fill: {
                opacity: 1,
                type: 'gradient',
                gradient: {
                    type: 'vertical',
                    shadeIntensity: 1,
                    inverseColors: !1,
                    opacityFrom: 0.3,
                    opacityTo: 0.05,
                    stops: [100, 100],
                },
            },
            tooltip: {
                x: {
                    show: false,
                },
            },
            series: [
                {
                    name: 'Sales',
                    data: [...this.allSalesOperations.map((amount:any)=> amount.totelAmount)],
                },
            ],
        };
    }
}
