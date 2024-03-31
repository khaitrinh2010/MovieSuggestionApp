async function fetchMovieDetails(req, res) {
    const movieTitle = req.body
    try {
      const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
        params: {
          api_key: 'your_tmdb_api_key',
          query: movieTitle,
        },
      });
  
      const results = tmdbResponse.data.results;
      if (results.length > 0) {
        const firstResult = results[0];
        const posterPath = firstResult.poster_path;
        const posterUrl = `https://image.tmdb.org/t/p/original${posterPath}`;
        const description = firstResult.overview
        res.json({
            status: "success",
            posterUrl: posterUrl,
            description: description
        })
        // Here you can return the poster URL or do something with it
      } else {
        res.json({status: "fail"})
      }
    } catch (error) {
      console.error('Error fetching movie details:', error);
      res.json({status:"fail"})
    }
  }
module.exports = fetchMovieDetails  