<Box sx={{ width: '100%',border:"2px solid red" }}>
                                                                <Card
                                                                    sx={{
                                                                        height: 250,
                                                                        width: '100%',
                                                                        display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'center',
                                                                        border: value === label ? '2px solid blue' : '1px solid gray',
                                                                        cursor: 'pointer',
                                                                    }}
                                                                >
                                                                    <CardContent sx={{ textAlign: 'center', width: '100%' }}>
                                                                        {label.charAt(0).toUpperCase() + label.slice(1).replace(/([A-Z])/g, ' $1')}
                                                                    </CardContent>
                                                                </Card>
                                                            </Box>