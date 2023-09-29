import Image from "next/image";
import { useEffect, useState } from "react";
import axios from "axios";
import { Container, CircularProgress, TextField, Button, FormControl, InputLabel, Select, MenuItem, Dialog, DialogTitle, DialogContent } from "@mui/material";

import ThumbnailCard from "@/components/ThumbnailCard";
import { OneApi } from "@/types/interface";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerate, setIsGenerate] = useState(false);
  const [data, setData] = useState<OneApi[]>([]);
  const [selectedData, setSelectedData] = useState<OneApi>();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Parameters
  const [title, setTitle] = useState('');
  const [albumTitle, setAlbumTitle] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [limit, setLimit] = useState(25);
  const [offset, setOffset] = useState(0);

  const [generatedText, setGeneratedText] = useState('');

  function getData(limit?: number, offset?: number) {
    setIsLoading(true);

    axios.get(`${process.env.ROOT_API}?title=${title}&album.title=${albumTitle}&album.user.email=${userEmail}&limit=${limit ? limit : 25}&offset=${offset ? offset : 0}`)
      .then(response => {
        setIsLoading(false);
        setData(response.data);
      });
  }

  function selectData(data: OneApi) {
    setSelectedData(data);
    setDialogOpen(true);

    setIsGenerate(true);

    axios.post('/api/interaction', { url: data.url })
      .then(response => {
        setIsGenerate(false);
        setGeneratedText(response.data[0].generated_text);
      });
  }


  // Pagination handlers

  function moveToPrev() {
    if (offset > 0) {
      setOffset(prev => prev - limit);
      getData(limit, offset - limit);
    }
  }

  function moveToNext() {
    setOffset(prev => prev + limit);
    getData(limit, offset + limit);
  }

  function handleLimit(value: number) {
    setLimit(value);
    getData(value, offset);
  }


  // Fetch data at first

  useEffect(() => {
    getData(limit, offset);
  }, []);

  return (
    <main className="flex flex-col justify-center items-center">
      <h1 className="text-3xl my-8">MetaPhoto</h1>

      <div className="flex justify-center items-center mb-8">
        <TextField
          label="Title"
          variant="outlined"
          className='mx-2'
          value={title}
          onChange={({ target: { value } }) => setTitle(value)}
        />
        <TextField
          label="Album Title"
          variant="outlined"
          className='mx-2'
          value={albumTitle}
          onChange={({ target: { value } }) => setAlbumTitle(value)}
        />
        <TextField
          label="User Email"
          variant="outlined"
          className='mx-2'
          value={userEmail}
          onChange={({ target: { value } }) => setUserEmail(value)}
        />

        <Button
          variant="contained"
          className="px-8 py-4 mx-4 bg-blue-500"
          onClick={() => getData(limit, offset)}
        >
          Search
        </Button>
      </div>

      <div className="flex justify-center">
        <Button
          variant="contained"
          className="px-8 py-3 mx-4 bg-orange-500"
          onClick={moveToPrev}
        >
          Prev
        </Button>

        <Button
          variant="contained"
          className="px-8 py-3 mx-4 bg-green-500"
          onClick={moveToNext}
        >
          Next
        </Button>

        <FormControl fullWidth className="mx-6">
          <InputLabel id="demo-simple-select-label">Limit</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={limit}
            onChange={({ target: { value } }) => handleLimit(Number(value))}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
      </div>

      <Container maxWidth="xl" className="mt-8 mb-20">
        {
          isLoading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <div className="flex flex-wrap w-full">
              {
                data.map((item: OneApi) => (
                  <ThumbnailCard key={item.id} data={item} setter={selectData} />
                ))
              }
            </div>
          )
        }
      </Container>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle className="text-center">{selectedData?.title}</DialogTitle>

        <DialogContent className="flex flex-col">
          <Image alt="preivew" src={selectedData ? selectedData.url : ''} width={600} height={600} priority />

          <h1 className="font-bold text-center text-xl text-red-500 my-8">
            {isGenerate ? <CircularProgress /> : generatedText}
          </h1>
        </DialogContent>
      </Dialog>
    </main>
  )
}
