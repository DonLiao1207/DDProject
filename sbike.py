import os
import time
import pandas as pd
import numpy as np
import json
import re
import math
import matplotlib.pyplot as plt
from bokeh.plotting import figure, show
import pandas_bokeh
from bokeh.io import output_notebook
from scipy import stats
from mpl_toolkits import mplot3d
from mpl_toolkits.mplot3d import Axes3D
from sklearn.preprocessing import LabelEncoder
output_notebook()
pd.set_option('display.min_rows', 100)
pd.set_option('display.max_rows', 9999)
pd.set_option('display.max_columns', 500)
pd.set_option('display.width', 1000)
np.set_printoptions(precision=3, suppress=True)
