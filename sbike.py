# -*- coding: utf-8 -*-
import os
import time
import pandas as pd
import numpy as np
import json
import re
import math	
import can
from scipy import stats
from sklearn.preprocessing import LabelEncoder
import threading

'''
Read canbus output txt file
['4.339022', '1', 'F9', 'Rx', '3', '00', '03', '2B', '7']
資料位置[0]=時間, [2]=抓出F9(上控傳輸關心項目) [5]=項目內容如下 [6][7]=16進制之項目rawdata
00		Torque
01		RPM
02		馬達轉速
03		車速
04		助力命令
05		IQ命令
06		馬達時速
07		馬達RPM
08		功率
09		助力模式

'''


class CanBusPreProcess:
    def __init__(self):
        self.fe = ['torque', 'rpm', 'speed', 'iq_cmd', 'mrpm']
        self.can_bus_ch = 'can0'
        os.system(f'sudo ip link set {self.can_bus_ch} type can bitrate 500000')
        os.system(f'sudo ifconfig {self.can_bus_ch} up')
        self.can_obj = can.interface.Bus(channel=self.can_bus_ch, bustype='socketcan')

    def receive_only(self):
        while True:
            msg = self.can_obj.recv(10.0)
            print(msg)
            if msg is None:
                print('Time Out')
                break
        os.system(f'sudo ifconfig {can_bus_ch} down')

    @staticmethod
    def load_canbus_msg(input_msg_list):
        torque_ori = []
        trpm_ori = []
        speed_ori = []
        iqc_ori = []
        mrpm_ori = []
        ast_mode = []
        time_ori = []
        load_data = [time_ori, torque_ori, trpm_ori, speed_ori, iqc_ori, mrpm_ori, ast_mode]
        match = {'00': 1, '01': 2, '03': 3, '05': 4, '07': 5, '09': 6}
        print(input_msg_list)
        for input_msg in input_msg_list:
            if input_msg[2] == 'F9':
                try:
                    idx = match[input_msg[5]]
                    if idx != 6:
                        hex_v = input_msg[6] + input_msg[7]
                        v = int(hex_v, base=16)
                        load_data[idx].append(v)
                    else:
                        v = int(input_msg[7])
                        load_data[0].append(input_msg[0])
                        load_data[idx].append(v)
                except Exception as E:
                    pass
            load_data = pd.DataFrame(load_data).T
            # self.pre_data = self.pre_data[(np.abs(stats.zscore(self.pre_data)) < 5.5)]
            col_names = ['time', 'torque', 'rpm', 'speed', 'iq_cmd', 'mrpm', 'ast_mode']
            load_data.columns = col_names
            return load_data

    def data_filter(self, pre_filter_df, z_th):
        for fe_str in self.fe:
            pre_filter_df[fe_str] = pre_data[fe_str].astype('float')
            pre_filter_df = pre_filter_df[(np.abs(stats.zscore(pre_filter_df[fe_str])) < z_th)]
            # pre_filter_df = pre_filter_df[pre_filter_df[fe_str] > 0.5]
            pre_filter_df = pre_filter_df.astype({"ast_mode": "str"})
            pre_filter_df = pre_filter_df.reset_index(drop=True)
        return pre_filter_df

    def cal_stat(self, part_arr, arr_str, ast_m=True):
        stat_names = ['Minimum', 'Maximum', 'Mean', 'STD', 'Variance', 'Mode', 'PTP',
                      'Median', 'Skew', 'Kurtosis']
        temp_stat = []
        for p in part_arr:
            p_min = np.min(p[arr_str])
            p_max = np.max(p[arr_str])
            p_mean = np.mean(p[arr_str])
            p_std = np.std(p[arr_str])
            # p_cov = np.cov(p['torque'].astype(float))
            p_var = np.var(p[arr_str])
            p_mod = stats.mode(p[arr_str])[0][0]
            p_ptp = np.ptp(p[arr_str])
            p_median = np.median(p[arr_str])
            p_skew = stats.skew(p[arr_str])
            p_kuto = stats.kurtosis(p[arr_str])
            temp_stat.append([p_min, p_max, p_mean, p_std, p_var, p_mod, p_ptp, p_median, p_skew, p_kuto])
        if ast_m:
            ast_str = 'ast_mode'
        else:
            ast_str = 'cluster_ast_mode'
        temp_stat = pd.DataFrame(np.round(temp_stat, 2),
                                 index=[f'{ast_str}_0', f'{ast_str}_1', f'{ast_str}_2', f'{ast_str}_3'])
        temp_stat.columns = stat_names
        return temp_stat

    # thread for data ingestion and inference
    def handler_data_preprocess(self, agg_num):
        can_list = []
        time_set_diff_value = 0.085
        time_now = time.time()
        while True:
            try:
                # read canbus msg
                msg = self.can_obj.recv(10.0)
                msg_hex = msg.data.hex()
                
                msg_head = msg_hex[0:2]
                msg_body = msg_hex[2:]
               
                # print(f'message_data_body: {int(msg_body, base=16)}')                
                msg_strip = re.split("\s+", str(msg).strip())
                # time value and tag index
                time_idx = msg_strip[0]
                time_v = msg_strip[1]
                '''
                print(time_idx, float(time_v)-time_now)
                print(f'message_data_hex: {msg_hex}')
                print(f'message_data_head: {int(msg_body, base=16)}')
                print(f'arbit_id: {str(hex(msg.arbitration_id))}')
                '''
                # time.sleep(0.5)
                # check the data in 1 second:(1)time (2)0A position
                if can_list:
                    time_v_start = can_list[0][1]
                    item_idx_start = can_list[0][5]
                    time_diff = float(time_v) - float(time_v_start)
                    # print(f'time diff:{time_diff}')
                    # It's mean the data is the next second's data set
                    if time_diff > 0.085 or time_idx == '0a':
                        print(f'*-----can list length------*: {len(can_list)}')
                        pre_data = self.load_canbus_msg(can_list)
                        print(pre_data)
                        can_list = []
                        can_list.append(msg_strip)
                    else:
                        can_list.append(msg_strip)
                else:
                    can_list.append(msg_strip)
                # parse msg start
                # aggregate
                if msg is None:
                    print('******ERROR******:Time Out!')
                    break
            except Exception as E:
                print(E.args)
    # thread for unicorn LED control

    def handler_unicorn_control(self):
        print("handler_unicorn_control")

sbk = CanBusPreProcess()
print("*1.--thread 1 start--*")
th1_data_infer = threading.Thread(target=sbk.handler_data_preprocess(3, ))
th1_data_infer.start()
# sbk.receive_only()
# sbk.pre_data
