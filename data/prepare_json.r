library(jsonlite)
library(tidyverse)

# Do not show column specifications when loading files with read_csv().
options(readr.show_col_types = FALSE)

merged <- read_csv("./population.csv") |>
  inner_join(read_csv("./life-expectancy.csv")) |>
  inner_join(read_csv("./gdp-per-capita.csv")) |>
  inner_join(read_csv("./continents-according-to-our-world-in-data.csv") |>
             select(-Year)) |>
  select(country    = Entity,
         code       = Code,
         year       = Year,
         population = 4,
         expectancy = 5,
         gdp        = 6,
         continent  = 7)

toJSON(merged) |>
  write_file("../src/data/dataset.json")

